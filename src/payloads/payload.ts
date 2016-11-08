import  { DeSenseNoisePayload } from "./DeSenseNoisePayload";

export interface Payload {
    createdAt: Date;
    payloadType: PayloadType;
}

export enum PayloadType {
  DeSenseNoise = <any> DeSenseNoisePayload
}