/// <reference path="../_all.d.ts" />

import { DBLoki } from "./BDLoki";
import { Result, DeviceInfo } from "./DeviceInfoValue";
import { ServerResponse } from "http";

class DeviceInfoService {

    private deviceData: LokiCollection<DeviceInfo>;

    constructor() {
        this.deviceData = DBLoki.deviceData;
    }

    rootGET(req: any, res: ServerResponse, next: any) {
        res.setHeader("Content-Type", "application/json");

        let devEUI: string = req.devEUI.value;
        let limit: number = req.limit.value;
        let offset: number = req.offset.value;
        let order: string = req.order.value;
        let start: string = req.start.value;
        let stop: string = req.stop.value;

        // TODO dodělat vyběr podle start a stop
        let result = this.deviceData.chain().where((data) => data.devEUI === devEUI);

        if (offset !== undefined && offset !== null) {
            result = result.offset(offset);
        }
        if (limit !== undefined && limit !== null) {
            result = result.limit(limit);
        }
        if (order !== undefined && order !== null && (order === "desc" || order === "asc")) {
            result.sort((device1, device2) => {
                let date1 = new Date(device1.createdAt);
                let date2 = new Date(device2.createdAt);
                if (date1 === date2) { return 0; }
                if (order === "desc") {
                    return date1 < date2 ? 1 : -1;
                } else {
                    return date1 < date2 ? -1 : 1;
                }
            });
        }
        let jsonResult = new Result(result.data());
        res.end(JSON.stringify(jsonResult));
    }
}

export default DeviceInfoService;