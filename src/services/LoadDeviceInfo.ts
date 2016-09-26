/// <reference path="../_all.d.ts" />

import * as DeviceInfoValue from "./DeviceInfoValue";
import * as Lokijs from "lokijs";
import * as http from "http";
import {CRaService} from "./CRaService";

/**
 * Provádí načtení dat z API ČRa do DB.
 */
export class LoadDeviceInfo {

    private db: Loki;
    private users: LokiCollection<DeviceInfoValue.DeviceInfo>;

    constructor() {
        this.db = new Lokijs("example.db");
        this.users = this.db.addCollection<DeviceInfoValue.DeviceInfo>("deviceInfo");
    }

    update() {
        let cRaService = new CRaService();
        console.log("updaaaaaaaate");
        cRaService.getDeviceInfo("0018B20000000336");
        console.log("tamta");
    }
}