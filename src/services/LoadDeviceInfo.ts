/// <reference path="../_all.d.ts" />

import * as DeviceInfoValue from "./DeviceInfoValue";
import * as Lokijs from "lokijs";
import * as http from "http";

/**
 * Provádí načtení dat z API ČRa do In-memory DB.
 */
class LoadDeviceInfo {

    private db: Loki;
    private users: LokiCollection<DeviceInfoValue.DeviceInfo>;

    constructor() {
        this.db = new Lokijs("example.db");
        this.users = this.db.addCollection<DeviceInfoValue.DeviceInfo>("deviceInfo");
    }
}