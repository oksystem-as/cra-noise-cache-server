/// <reference path="../_all.d.ts" />

import { DBLoki } from "./BDLoki";
import { Result, DeviceInfo } from "./DeviceInfoValue";
import * as Lokijs from "lokijs";
import * as http from "http";

class DeviceInfoService {

    private deviceData: LokiCollection<DeviceInfo>;

    constructor() {
        this.deviceData = DBLoki.deviceData;
    }

    rootGET(req: any, res: http.ServerResponse, next: any) {
        let devEUI = req.devEUI.value;
        let token  = req.token.value;
        /*
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
         */
        let result = this.deviceData.chain().where((data) => data.devEUI === "0018B20000000336").data();
        //let result = this.deviceData.find({ "devEUI": "0018B20000000336" }).data();
        //result.forEach((value, index, array) => console.log(value));
        //let result = this.deviceData.find();
        //console.log(JSON.stringify(result));
        console.log("======================================");
        let jsonResult = new Result(result);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(jsonResult));
    }
}

export default DeviceInfoService;