/// <reference path="../_all.d.ts" />

import { DBLoki } from "./BDLoki";
import { Result, DeviceInfo, LastRecord } from "./DeviceInfoValue";
import {Promise} from "es6-promise";
import { CRaService } from "./CRaService";
import * as Lokijs from "lokijs";

/**
 * Provádí načtení dat z API ČRa do DB.
 */
export class LoadDeviceInfo {

    private deviceData: LokiCollection<DeviceInfo>;
    private lastData: LokiCollection<LastRecord>;

    constructor() {
        this.deviceData = DBLoki.deviceData;
        this.lastData = DBLoki.lastData;
    }

    update() {
        let devEUI = "0018B20000000336";
        let cRaService = new CRaService();

        let lastRecords = this.getLastRecords(devEUI);
        let startDate: Date;
        if (lastRecords === null || lastRecords === undefined) {
            startDate = new Date("2016-01-01T00:00:00+0000");
        } else {
            startDate = lastRecords.createdAt;
            startDate.setUTCSeconds(startDate.getUTCSeconds() + 1);
        }
        console.log(this.dateToString(startDate));
        let promise = cRaService.getDeviceInfo(devEUI, 10000, this.dateToString(startDate), "asc");
        promise.then((result) => {
            console.log(result._meta);
            this.updateDB(devEUI, result);
        });
    }

    private updateDB(devEUI: string, result: Result) {
        if (result._meta.count > 0) {
            let lastRecords = this.getLastRecords(devEUI);
            result.records.forEach((deviceInfo) => {
                this.deviceData.insert(deviceInfo);
                lastRecords = this.lastRecords(lastRecords, {devEUI: deviceInfo.devEUI, createdAt: new Date(deviceInfo.createdAt) });
            });
            console.log(result._meta);
            console.log(lastRecords.createdAt);
            try {
                this.lastData.removeWhere((data) => data.devEUI === devEUI);
            } catch (error) {
                console.log(error);
            } finally {
                try {
                    this.lastData.insert(lastRecords);
                } catch (error) {
                    console.log(error);
                }
            }
            console.log("===============================================");
        }
    }

    private getLastRecords(devEUI: string): LastRecord {
        return this.lastData.by("devEUI", devEUI);
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