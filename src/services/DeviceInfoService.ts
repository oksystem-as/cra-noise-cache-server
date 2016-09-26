/// <reference path="../_all.d.ts" />

import * as Lokijs from "lokijs";
import * as http from "http";

class Result {
    _meta: Meta;
    records: Array<DeviceInfo>;

    constructor(records: Array<DeviceInfo>) {
        this._meta = { status: "SUCCESS", count: records.length };
        this.records = Array<DeviceInfo>(records.length);
        records.forEach((element, index) => {
            this.records[index] = new DeviceInfo(element);
        });
    }
}

interface Meta {
    status: string;
    count: number;
}

class DeviceInfo {

    createdAt: string;
    devEUI: string;
    fPort: number;
    fCntUp: number;
    aDRBit: number;
    fCntDn: number;
    payloadHex: string;
    micHex: string;
    lrrRSSI: string;
    lrrSNR: string;
    spFast: number;
    subBand: string;
    channel: string;
    devLrrCnt: number;
    lrrid: string;
    lrrLAT: string;
    lrrLON: string;
    lrrs: Array<Irrs>;

    constructor(deviceInfo: DeviceInfo) {
        this.createdAt = deviceInfo.createdAt;
        this.devEUI = deviceInfo.devEUI;
        this.fPort = deviceInfo.fPort;
        this.fCntUp = deviceInfo.fCntUp;
        this.aDRBit = deviceInfo.aDRBit;
        this.fCntDn = deviceInfo.fCntDn;
        this.payloadHex = deviceInfo.payloadHex;
        this.micHex = deviceInfo.micHex;
        this.lrrRSSI = deviceInfo.lrrRSSI;
        this.lrrSNR = deviceInfo.lrrSNR;
        this.spFast = deviceInfo.spFast;
        this.subBand = deviceInfo.subBand;
        this.channel = deviceInfo.channel;
        this.devLrrCnt = deviceInfo.devLrrCnt;
        this.lrrid = deviceInfo.lrrid;
        this.lrrLAT = deviceInfo.lrrLAT;
        this.lrrLON = deviceInfo.lrrLON;
        this.lrrs = deviceInfo.lrrs;
    }
}

interface Irrs {
    Lrrid: string;
    LrrRSSI: string;
    LrrSNR: string;
}

class DeviceInfoService {

    private db: Loki;
    private users: LokiCollection<DeviceInfo>;

    constructor() {
        this.db = new Lokijs("example.db");
        this.users = this.db.addCollection<DeviceInfo>("deviceInfo");
    }

    rootGET(req: any, res: http.ServerResponse, next: any) {
        let devEUI = req.devEUI.value;
        let token  = req.token.value;
        this.users.insert(new DeviceInfo({
            createdAt: "aaa",
            devEUI: devEUI,
            fPort: 1,
            fCntUp: 1,
            aDRBit: 1,
            fCntDn: 1,
            payloadHex: "aaa",
            micHex: "aaa",
            lrrRSSI: "aaa",
            lrrSNR: "aaa",
            spFast: 1,
            subBand: "aaa",
            channel: "aaa",
            devLrrCnt: 1,
            lrrid: "aaa",
            lrrLAT: "aaa",
            lrrLON: "aaa",
            lrrs: [{ Lrrid: "Lrrid", LrrRSSI: "LrrRSSI", LrrSNR: "LrrSNR"}, { Lrrid: "Lrrid1", LrrRSSI: "LrrRSSI1", LrrSNR: "LrrSNR1"}]
         }));
        let result = this.users.chain().where(() => true).data();
        //result.forEach((value, index, array) => console.log(value));
        console.log(JSON.stringify(result));
        console.log("======================================");
        let jsonResult = new Result(result);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(jsonResult));
    }
}

export default DeviceInfoService;