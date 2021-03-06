/// <reference path="../_all.d.ts" />

import { DeviceInfo } from "./DeviceInfoValue";
import  { DeSenseNoisePayload } from "../payloads/DeSenseNoisePayload";
import { PayloadType } from "../payloads/payload";
import { DeSenseNoisePayloadCreator } from "../payloads/DeSenseNoisePayloadCreator";
import * as jsYaml from "js-yaml";
import * as fs from "fs";

export class MockData {
    devEUI: string;
    records: DeviceInfo[];
}

export class CreateMockData {

    createMockData(devEUI: string, fromDate: Date, toDate: Date): MockData {
        let createdAt = new Date(fromDate);
        let mockData = new MockData();
        mockData.devEUI = devEUI;
        mockData.records = [];
        while (createdAt.getTime() < toDate.getTime()) {
            createdAt.setMinutes(createdAt.getMinutes() + 5);
            let randomData = this.createRandomNoiseSensorData(createdAt);
            let randomPayload = this.getNoiseSensorPayload(randomData);
            mockData.records.push(this.toMockYaml(devEUI, createdAt, randomPayload));
        }
        return mockData;
    }

    private toMockYaml(devEUI: string, createdAt: Date, payload: string): DeviceInfo {
        let mockDeviceInfo: DeviceInfo = { };
        mockDeviceInfo.createdAt = createdAt.getUTCFullYear() + "-" + this.twoDigits(createdAt.getUTCMonth() + 1) +
                                    "-" + this.twoDigits(createdAt.getUTCDate()) + "T" + this.twoDigits(createdAt.getUTCHours()) +
                                    ":" + this.twoDigits(createdAt.getUTCMinutes()) + ":" + this.twoDigits(createdAt.getUTCSeconds()) + "+0000";
        mockDeviceInfo.payloadHex = payload;
        mockDeviceInfo.devEUI = devEUI;
        return mockDeviceInfo;
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
        let randomData = this.createRandomData(createdAt);
        return { createdAt: createdAt, payloadType: PayloadType.DeSenseNoise,
                 rssi: randomData.rssi, snr: randomData.snr,
                 battery: randomData.batt, noise: randomData.noise };
    }

    private createRandomData(createdAt: Date): { rssi: number, snr: number, batt: number, noise: number } {
        let rssi = this.randomNumber(0, 255);
        let snr = this.randomNumber(-128, 126);
        let batt = this.randomNumber(0, 65535) / 1000;
        let noise = this.createRandomNoise(createdAt);
        return { rssi, snr, batt, noise };
    }

    private createRandomNoise(createdAt: Date): number {
        if (createdAt.getHours() >= 22 && createdAt.getHours() <= 6) {
            return this.randomNumber(20, 28);
        }
        if (createdAt.getHours() >= 8 && createdAt.getHours() <= 12) {
            return this.randomNumber(30, 36);
        }
        if (createdAt.getHours() >= 13 && createdAt.getHours() <= 18) {
            return this.randomNumber(35, 40);
        }
        if (createdAt.getHours() >= 19 && createdAt.getHours() <= 20) {
            return this.randomNumber(30, 36);
        }
        // 7 hodina a 21 hodina
        return this.randomNumber(25, 28);
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