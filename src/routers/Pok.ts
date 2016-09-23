/// <reference path="../_all.d.ts" />

import PokService from "../services/PokService";

var pok = new PokService();

export function rootGET(req: any, res: any, next: any) {
    return pok.rootGET(req.swagger.params, res, next);
}