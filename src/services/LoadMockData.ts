/// <reference path="../_all.d.ts" />

import { DBLoki } from "./BDLoki";
import { DeviceInfo } from "./DeviceInfoValue";
import { Promise } from "es6-promise";
import * as jsYaml from "js-yaml";
import * as Lokijs from "lokijs";
import * as fs from "fs";

export class LoadMockData {

    private deviceData: LokiCollection<DeviceInfo>;

    constructor() {
        this.deviceData = DBLoki.deviceData;
    }

    loadAll(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let mocksFile = fs.readdirSync("mocks");
            this.updateAll(mocksFile);
            resolve(true);
        });
    }

    updateAll(devEUIs: string[]) {
        devEUIs.forEach((devEUI) => {
            this.update(devEUI);
        });
    }

    update(devEUI: string) {
        var mockFile = fs.readFileSync("mocks/" + devEUI, "UTF-8");
        var mock: { devEUI: string, records: DeviceInfo[] } = jsYaml.safeLoad(mockFile);
        mock.records.forEach((value) => {
            let deviceInfo = value;
            deviceInfo.devEUI = mock.devEUI;
            console.log("Načitám mock: " + deviceInfo.devEUI + ", " + deviceInfo.createdAt + ", " + deviceInfo.payloadHex);
            this.updateDB(deviceInfo);
        });
    }

    private updateDB(deviceInfo: DeviceInfo) {
        this.deviceData.insert(deviceInfo);
    }

}