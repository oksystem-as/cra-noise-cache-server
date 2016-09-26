/// <reference path="../_all.d.ts" />

import DeviceInfoService from "../services/DeviceInfoService";

var pok = new DeviceInfoService();

export function rootGET(req: any, res: any, next: any) {
    return pok.rootGET(req.swagger.params, res, next);
}