/// <reference path="../_all.d.ts" />

import { DeviceInfo } from "./DeviceInfoValue";
import  { DeSenseNoisePayload } from "../payloads/DeSenseNoisePayload";
import { PayloadType } from "../payloads/payload";
import { DeSenseNoisePayloadCreator } from "../payloads/DeSenseNoisePayloadCreator";
import * as jsYaml from "js-yaml";
import * as fs from "fs";

class MockData {
    devEUI: string;
    records: Record[];
}

class Record {
    createdAt: string;
    payloadHex: string;
}

export class CreateMockData {

    createMockData(devEUI: string, fromDate: Date, toDate: Date) {
        let createdAt = new Date(fromDate);
        let mockData = new MockData();
        mockData.devEUI = devEUI;
        mockData.records = [];
        while (createdAt.getTime() < toDate.getTime()) {
            let randomData = this.createRandomNoiseSensorData(createdAt);
            let randomPayload = this.getNoiseSensorPayload(randomData);
            mockData.records.push(this.toMockYaml(createdAt, randomPayload));
            createdAt.setMinutes(createdAt.getMinutes() + 5);
        }
        /*
        let records: Record[] = [];
        let record1 = new Record();
        record1.createdAt = "createdAt1";
        record1.payloadHex = "payloadHex1";
        records.push(record1);
        let record2 = new Record();
        record2.createdAt = "createdAt2";
        record2.payloadHex = "payloadHex2";
        records.push(record2);
        let mocData = new MockData();
        mocData.devEUI = "aaaaaaaaaaaaa";
        mocData.records = records;        
        */
        this.saveToFile(mockData);
    }

    private toMockYaml(createdAt: Date, payload: string): Record {
        let mockDeviceInfo = new Record();
        mockDeviceInfo.createdAt = createdAt.getUTCFullYear() + "-" + this.twoDigits(createdAt.getUTCMonth()) +
                                    "-" + this.twoDigits(createdAt.getUTCDate()) + "T" + this.twoDigits(createdAt.getUTCHours()) +
                                    ":" + this.twoDigits(createdAt.getUTCMinutes()) + ":" + this.twoDigits(createdAt.getUTCSeconds()) + "+0000";
        mockDeviceInfo.payloadHex = payload;
        return mockDeviceInfo;
    }

    private saveToFile(mockData: MockData) {
        let yamlDoc = jsYaml.safeDump(mockData);
        console.log(yamlDoc);
    }

    private getNoiseSensorPayload(sensorData: DeSenseNoisePayload) {
        let creator = new DeSenseNoisePayloadCreator();
        let payload = creator.create(10, sensorData.rssi, sensorData.snr, sensorData.battery, sensorData.noise);
        let checkData = creator.resolve(payload);
        if (checkData.rssi === sensorData.rssi && checkData.snr === sensorData.snr
         && checkData.battery === sensorData.battery && checkData.noise === sensorData.noise) {
            return payload;
        }
        console.warn(sensorData);
        console.warn(checkData);
        throw new Error("Neschoduje se vygenerovaný payload se zpětně převedeným payloadem.");
    }

    private createRandomNoiseSensorData(createdAt: Date): DeSenseNoisePayload {
        let randomData = this.createRandomData();
        return { createdAt: createdAt, payloadType: PayloadType.DeSenseNoise,
                 rssi: randomData.rssi, snr: randomData.snr,
                 battery: randomData.batt, noise: randomData.noise };
    }

    private createRandomData(): { rssi: number, snr: number, batt: number, noise: number } {
        let rssi = this.randomNumber(0, 255);
        let snr = this.randomNumber(-128, 126);
        let batt = this.randomNumber(0, 65535) / 1000;
        let noise = this.randomNumber(30, 130);
        return { rssi, snr, batt, noise };
    }

    private randomNumber(from: number, to: number): number {
        return Math.floor(Math.random() * to) + from;
    }

    private twoDigits(num: number): string {
        if (num < 10) {
            return "0" + num;
        }
        return num.toString();
    }

}