/// <reference path="../_all.d.ts" />

import * as path from "url";

class PokService {

    rootGET(req: any, res: any, next: any) {
        console.log("neco");
        res.end();
    }
}

export default PokService;