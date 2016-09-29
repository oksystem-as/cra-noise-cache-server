/// <reference path="_all.d.ts" />
"use strict";

import * as swaggerTools from "swagger-tools";
import * as jsYaml from "js-yaml";
import * as fs from "fs";
import * as express from "express";
import * as morgan from "morgan";
import { LoadDeviceInfo } from "./services/LoadDeviceInfo";
import { LoadDevideConfig, CRaApiConfig } from "./Config";

namespace UpdateCache {
  export let devEUIs: string[];

  export function updateCache() {
    let loadDeviceInfo = new LoadDeviceInfo();
    loadDeviceInfo.updateAll(devEUIs);
  }
}

class Server {

  public app: express.Application;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    //create expressjs application
    this.app = express();

    this.app.use(morgan(":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" " +
                        ":status :res[content-length] :response-time ms \":referrer\" \":user-agent\""));

    this.configCache();
    this.routes();
  }

  private configCache() {
    var config = fs.readFileSync("config.yaml", "UTF-8");
    var cacheConfig = jsYaml.safeLoad(config);
    if (cacheConfig.token !== undefined && cacheConfig.token !== null) {
      CRaApiConfig.token = cacheConfig.token;
    }
    UpdateCache.devEUIs = cacheConfig.devEUIs;

    UpdateCache.updateCache();
    setInterval(function() {
      try {
        UpdateCache.updateCache();
      } catch (error) {
        console.error(error);
      }
    }, LoadDevideConfig.updateInterval);
  }

  private routes() {
    var spec = fs.readFileSync("docs/swagger.yaml", "UTF-8");
    var swaggerDoc = jsYaml.safeLoad(spec);
    swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
      // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
      this.app.use(middleware.swaggerMetadata());

      // Validate Swagger requests
      this.app.use(middleware.swaggerValidator());

      // Route validated requests to appropriate controller
      this.app.use(middleware.swaggerRouter({ controllers: "./src/routers" }));

      // Serve the Swagger documents and Swagger UI
      this.app.use(middleware.swaggerUi());
     });
  }
}

var server = Server.bootstrap();
export = server.app;