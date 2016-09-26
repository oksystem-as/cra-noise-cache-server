/// <reference path="../_all.d.ts" />

import LoadDeviceInfo from "../services/LoadDeviceInfo";

let loadDeviceInfo = new LoadDeviceInfo();

export function execute(event: any) {
    loadDeviceInfo.update();
}