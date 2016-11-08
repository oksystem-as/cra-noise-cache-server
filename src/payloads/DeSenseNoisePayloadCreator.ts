import  { DeSenseNoisePayload } from "./DeSenseNoisePayload";

export class DeSenseNoisePayloadCreator {

//0aff7e0c640fa0
    public resolve(payload: String): DeSenseNoisePayload {
        let deSenseNoisePayload = new DeSenseNoisePayload();
        let charArrPayload = payload.split("");

        let sensorType =  parseInt(charArrPayload[0] + charArrPayload[1] , 16);
        if (sensorType !== 10) {
            throw new Error("Nepodporovany typ sensoru. sensorType:" + sensorType);
        }

        let rssi = parseInt(charArrPayload[2] + charArrPayload[3], 16);
        deSenseNoisePayload.rssi = rssi;

        let snr = parseInt(charArrPayload[4] + charArrPayload[5], 16);
        deSenseNoisePayload.snr = snr - 128;

        let batt = parseInt(charArrPayload[6] + charArrPayload[7] + charArrPayload[8] + charArrPayload[9], 16);
        deSenseNoisePayload.battery = batt / 1000;

        let noise = parseInt(charArrPayload[10] + charArrPayload[11] + charArrPayload[12] + charArrPayload[13], 16);
        deSenseNoisePayload.noise = noise / 100;

        return deSenseNoisePayload;
    }

    public create(sensorType: number, rssi: number, snr: number, batt: number, noise: number): string {
        let sensorTypeHex = this.toHexaString(sensorType, 2);
        let rssiHex = this.toHexaString(rssi, 2);
        let snrHex = this.toHexaString(snr + 128, 2);
        let b = Math.round(batt * 1000);
        let battHex = this.toHexaString(b, 4);
        let noiseHex = this.toHexaString(noise / 0.01, 4);
        return sensorTypeHex + rssiHex + snrHex + battHex + noiseHex;
    }

    private toHexaString(num: number, digit: number): string {
        let hexString = num.toString(16);
        return this.toHexDigit(hexString, digit);
    }

    private toHexDigit(hexStr: string, digit: number): string {
        if (hexStr.length > digit) {
            throw new Error("Moc míst: " + hexStr + ", " + digit);
        }
        if (hexStr.length === digit) {
            return hexStr;
        }
        return this.toHexDigit("0" + hexStr, digit);
    }
}