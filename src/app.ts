/// <reference path="_all.d.ts" />
"use strict";

import * as swaggerTools from "swagger-tools";
import * as jsYaml from "js-yaml";
import * as fs from "fs";
import * as express from "express";
import { LoadDeviceInfo } from "./services/LoadDeviceInfo";
import { LoadMockData } from "./services/LoadMockData";
import { LoadDevideConfig, CRaApiConfig } from "./Config";
import * as winston from "winston";
var expressWinston = require("express-winston");
require("console-winston")();

namespace UpdateCache {
  export let startup: boolean = false;
  export let startupMock: boolean = false;
  export let startupWSProd: boolean = false;
  export let startupFileProd: boolean = false;

  export function updateCache() {
    let loadMockDeviceInfo = new LoadMockData();
    loadMockDeviceInfo.loadAll(LoadDevideConfig.mockData).then((result) => {
      startupMock = true;
      startup = startupMock && (startupWSProd || startupFileProd);
    });
    let loadDeviceInfo = new LoadDeviceInfo();
    loadDeviceInfo.updateAll(LoadDevideConfig.loadData).then((result) => {
        startupWSProd = true;
        startup = startupMock && (startupWSProd || startupFileProd);
    });
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

    this.loggerConfig();

    this.app.use((req, res, next) => {
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    this.configStatusConfig();
    this.configCache();
    this.routes();
    this.app.listen(CRaApiConfig.serverPort);
  }

  private configCache() {
    var config = fs.readFileSync("config.yaml", "UTF-8");
    var cacheConfig = jsYaml.safeLoad(config);
    if (cacheConfig.token !== undefined && cacheConfig.token !== null) {
      CRaApiConfig.token = cacheConfig.token;
    }
    if (cacheConfig.serverPort !== undefined && cacheConfig.serverPort !== null) {
      CRaApiConfig.serverPort = cacheConfig.serverPort;
    }
    if (cacheConfig.basePath !== undefined && cacheConfig.basePath !== null) {
      CRaApiConfig.basePath = cacheConfig.basePath;
    }
    LoadDevideConfig.loadData = cacheConfig.loadData;
    LoadDevideConfig.cutData = cacheConfig.cutData;
    LoadDevideConfig.mockData = cacheConfig.mockData;

    let loadDeviceInfo = new LoadDeviceInfo();
    loadDeviceInfo.loadFromFiles(LoadDevideConfig.loadData);
    UpdateCache.startupFileProd = true;

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
      this.app.use(middleware.swaggerRouter({ controllers: "dist/routers" }));

      // Serve the Swagger documents and Swagger UI
      this.app.use(middleware.swaggerUi());
     });
  }

  private loggerConfig() {
    let logger = new winston.Logger({ transports: [ new winston.transports.Console({ json: true, colorize: true }) ] });

    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {
      //level: "debug",
      colorize: true
    });

    this.app.use(expressWinston.logger({
      transports: [ new winston.transports.Console({ json: true, colorize: true }) ],
      meta: true, // optional: control whether you want to log the meta data about the request (default to true) 
      msg: "HTTP {{req.method}} {{req.url}}",
      expressFormat: true,
      colorize: true
    }));
  }

  private configStatusConfig() {
    this.app.get("/startup", this.startUpGet);
  }

  private startUpGet(req: any, res: any, next: any) {
    if (UpdateCache.startup) {
      res.status(200).send();
    } else {
      res.status(503).send();
    }
  }
}

var server = Server.bootstrap();
export = server.app;