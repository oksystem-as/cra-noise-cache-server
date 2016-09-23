/// <reference path="../_all.d.ts" />

import * as Lokijs from "lokijs";

class PokService {

    private db = new Lokijs("example.db");

    rootGET(req: any, res: any, next: any) {
        console.log("neco");
        res.end();
    }
}

export default PokService;