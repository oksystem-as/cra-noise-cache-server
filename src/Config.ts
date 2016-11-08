/// <reference path="_all.d.ts" />

export namespace LoadDevideConfig {
    export let cutData: { start: string, devEUIs: string[] }[];
    export let mockData: { start: string, stop: string, devEUIs: string[] }[];
    /** První datum od kterého se načítají údaje ze senzotů */
    export const defautlStartDate = new Date("2016-01-01T00:00:00+0000");
    /** Limit kolik zaznamů se má vrátit v jednom dotazu na API ČRa */
    export const defautlLimit = 10000;
    /** Interval (v ms) po kterým se má kontrolovat aktuálnost cache. */
    export const updateInterval = 5 * 60 * 1000;
}

export namespace CRaApiConfig {
    export let basePath = "http://api.pripoj.me";
    export const deviceDetailBaseUrl = "/message/get/{devEUI}";
    export let token = "kBPIDfNdSfk8fkATerBa6ct6yshdPbOX";
    export let serverPort = 8080;
}