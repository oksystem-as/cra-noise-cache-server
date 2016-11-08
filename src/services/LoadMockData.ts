/// <reference path="../_all.d.ts" />

import { CreateMockData, MockData } from "./CreateMockData";
import { LoadDevideConfig } from "../Config";
import { DBLoki } from "./BDLoki";
import { DeviceInfo, LastRecord, Result } from "./DeviceInfoValue";
import { Promise } from "es6-promise";
import * as jsYaml from "js-yaml";
import * as Lokijs from "lokijs";
import * as fs from "fs";

export class LoadMockData {

    private deviceData: LokiCollection<DeviceInfo>;
    private lastData: LokiCollection<LastRecord>;

    constructor() {
        this.deviceData = DBLoki.deviceData;
        this.lastData = DBLoki.lastData;
    }

    loadAll(mockData: { start: string, stop: string, devEUIs: string[] }[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            mockData.forEach((mock) => {
                this.updateAll(mock.start, mock.stop, mock.devEUIs);
            });
            resolve(true);
        });
    }

    updateAll(start: string, stop: string, devEUIs: string[]) {
        devEUIs.forEach((devEUI) => {
            this.update(start, stop, devEUI);
        });
    }

    update(start: string, stop: string, devEUI: string) {
        let startDate = this.getStartDate(devEUI, start);
        let stopDate = new Date();
        if (stop != null) {
            stopDate = new Date(stop);
        }
        if (stopDate.getTime() > new Date().getTime()) {
            stopDate = new Date();
        }
        if (startDate.getTime() <= stopDate.getTime()) {
            console.log("Mockovaní data pro " + devEUI + " od " + startDate + ", do " + stopDate);
            let mockData = new CreateMockData().createMockData("0004A30B0019D0EB", startDate, stopDate);
            console.log(devEUI + " namockovano " + mockData.records.length + " zaznamů.");
            this.updateDB(mockData);
        }
    }

    private updateDB(mockData: MockData) {
        if (mockData.records.length > 0) {
            let lastRecords = this.getLastRecords(mockData.devEUI);
            mockData.records.forEach((deviceInfo) => {
                this.deviceData.insert(deviceInfo);
                lastRecords = this.lastRecords(lastRecords, {devEUI: deviceInfo.devEUI, createdAt: new Date(deviceInfo.createdAt) });
            });
            try {
                this.lastData.removeWhere((data) => data.devEUI === mockData.devEUI);
            } catch (error) {
                console.log(error);
            } finally {
                try {
                    this.lastData.insert(lastRecords);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    private getStartDate(devEUI: string, start: string): Date {
        let lastRecords = this.getLastRecords(devEUI);
        let startDate: Date;
        if (lastRecords === null || lastRecords === undefined) {
            if (start == null) {
                return LoadDevideConfig.defautlStartDate;
            } else {
                return new Date(start);
            }
        } else {
            startDate = lastRecords.createdAt;
            startDate.setUTCSeconds(startDate.getUTCSeconds() + 1);
            return startDate;
        }
    }

    private lastRecords(record1: LastRecord, record2: LastRecord): LastRecord {
        if ((record1 === null || record1 === undefined) && (record2 === null || record2 === undefined)) {
            return undefined;
        }
        if (record1 === null || record1 === undefined) {
            return record2;
        }
        if (record2 === null || record2 === undefined) {
            return record1;
        }
        if (record1.createdAt > record2.createdAt) {
            return record1;
        } else {
            return record2;
        }
    }

    private getLastRecords(devEUI: string): LastRecord {
        return this.lastData.by("devEUI", devEUI);
    }

    /** YYY-MM-DDTHH:MM:SS */
    private dateToString(date: Date): string {
        return date.getUTCFullYear() + "-" + this.twoNumber(date.getUTCMonth() + 1) + "-" + this.twoNumber(date.getUTCDate()) +
               "T" + this.twoNumber(date.getUTCHours()) + ":" + this.twoNumber(date.getUTCMinutes()) + ":" + this.twoNumber(date.getUTCSeconds());
    }

    private twoNumber(num: number): string {
        if (num < 10) {
            return "0" + num;
        }
        return num.toString();
    }

}