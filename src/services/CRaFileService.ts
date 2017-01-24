/// <reference path="../_all.d.ts" />

import { CRaApiConfig } from "../Config";
import { Result } from "./DeviceInfoValue";
import { Promise } from "es6-promise";
import request = require("request");
var fs = require("fs");

export class CRaFileService {

  /**    
   * @param devEUI ID čidla / zařízení.
   */
  public getDeviceInfo(devEUI: string): Result {
        console.log("Load from file " + devEUI + ".json");
        var content = fs.readFileSync(devEUI + ".json");
        return JSON.parse(content);
    }
}