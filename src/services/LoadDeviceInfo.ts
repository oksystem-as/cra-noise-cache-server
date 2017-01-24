/// <reference path="../_all.d.ts" />

import { LoadDevideConfig, SourceType } from "../Config";
import { DBLoki } from "./BDLoki";
import { Result, DeviceInfo, LastRecord } from "./DeviceInfoValue";
import { Promise } from "es6-promise";
import { CRaWebService } from "./CRaWebService";
import { CRaFileService } from "./CRaFileService";
import * as Lokijs from "lokijs";

/**
 * Provádí načtení dat z API ČRa do DB.
 */
export class LoadDeviceInfo {

    private deviceData: LokiCollection<DeviceInfo>;
    private lastData: LokiCollection<LastRecord>;
    private cRaFileService = new CRaFileService();

    constructor() {
        this.deviceData = DBLoki.deviceData;
        this.lastData = DBLoki.lastData;
    }
    /**
     * nacte data pro vsechny devEUIs ze souboru, soubor se musi jmenovat stejne jako je oznaceni devEUI + .json
     */
    loadFromFiles(loadData: { source: SourceType, devEUIs: string[] }[]) {
        loadData.forEach((load) => {
            if (load.source === SourceType.FILE) {
                load.devEUIs.forEach((devEUI) => {
                    this.loadFromFile(devEUI);
                });
            }
        });
    }

    /**
     * nacte data jen z jednoho souboru, soubor se musi jmenovat stejne jako je oznaceni devEUI + .json
     */
    loadFromFile(devEUI: string) {
        let result = this.cRaFileService.getDeviceInfo(devEUI);
        this.updateDB(devEUI, result);
        console.log(devEUI + ": Načteno " + result._meta.count + " záznamů ze souboru.");
    }

    updateAll(loadData: { source: SourceType, devEUIs: string[] }[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            loadData.forEach((load) => {
                if (load.source === SourceType.WS) {
                let devEUIsComplete = Array<string>();
                    load.devEUIs.forEach((devEUI) => {
                        this.update(devEUI).then((result) => {
                            if (devEUIsComplete.find((valeu) => valeu === result) == null) {
                                devEUIsComplete.push(result);
                            }
                            if (devEUIsComplete.length === load.devEUIs.length) {
                                resolve(true);
                            }
                        });
                    });
                }
            });
        });
    }

    update(devEUI: string): Promise<string> {
        let cRaWebService = new CRaWebService();
        let startDate = this.getStartDate(devEUI);

        let promise = cRaWebService.getDeviceInfo(devEUI, LoadDevideConfig.defautlLimit, startDate, "asc");
        return new Promise<string>((resolve, reject) => {
            promise.then((result) => {
                this.updateDB(devEUI, result);
                console.log(devEUI + ": Načteno " + result._meta.count + " záznamů.");
                if (result._meta.count > 0) {
                    this.update(devEUI).then((res) => resolve(res));
                } else {
                    console.log(devEUI + ": Aktualizace provedena");
                    resolve(devEUI);
                }
            });
        });
    }

    private getStartDate(devEUI: string): string {
        let lastRecords = this.getLastRecords(devEUI);
        let startDate: Date;
        if (lastRecords === null || lastRecords === undefined) {
            let cutDate = this.getCutDate(devEUI);
            if (cutDate == null) {
                return this.dateToString(LoadDevideConfig.defautlStartDate);
            } else {
                return this.dateToString(cutDate);
            }
        } else {
            startDate = lastRecords.createdAt;
            startDate.setUTCSeconds(startDate.getUTCSeconds() + 1);
            return this.dateToString(startDate);
        }
    }

    private getCutDate(devEUI: string): Date {
        let cutValue = LoadDevideConfig.cutData.find((value) => value.devEUIs.find((it) => it === devEUI) != null);
        if (cutValue == null) {
            return undefined;
        }
        let cutDate = new Date(cutValue.start);
        return cutDate;
    }

    private updateDB(devEUI: string, result: Result) {
        if (result._meta.count > 0) {
            let lastRecords = this.getLastRecords(devEUI);
            result.records.forEach((deviceInfo) => {
                this.deviceData.insert(deviceInfo);
                lastRecords = this.lastRecords(lastRecords, {devEUI: deviceInfo.devEUI, createdAt: new Date(deviceInfo.createdAt) });
            });
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