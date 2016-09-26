/// <reference path="../_all.d.ts" />

import * as DeviceInfoValue from "./DeviceInfoValue";
import * as Lokijs from "lokijs";
import * as http from "http";

class DeviceInfoService {

    private db: Loki;
    private users: LokiCollection<DeviceInfoValue.DeviceInfo>;

    constructor() {
        this.db = new Lokijs("example.db");
        this.users = this.db.addCollection<DeviceInfoValue.DeviceInfo>("deviceInfo");
    }

    rootGET(req: any, res: http.ServerResponse, next: any) {
        let devEUI = req.devEUI.value;
        let token  = req.token.value;
        this.users.insert(new DeviceInfoValue.DeviceInfo({
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
        let jsonResult = new DeviceInfoValue.Result(result);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(jsonResult));
    }
}

export default DeviceInfoService;