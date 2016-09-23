/// <reference path="../_all.d.ts" />

import * as path from "url";

class PokService {

    rootGET(req: any, res: any, next: any) {
        console.log("neco");
        res.end();
    }
}

var pok = new PokService();

export function rootGET(req: any, res: any, next: any) {
    return pok.rootGET(req, res, next);
}