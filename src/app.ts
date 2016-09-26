/// <reference path="_all.d.ts" />
"use strict";

import * as swaggerTools from "swagger-tools";
import * as jsYaml from "js-yaml";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import { LoadDeviceInfo } from "./services/LoadDeviceInfo";
//import * as sys from "sys";
//import webworker = require("webworker-threads");

//import * as indexRoute from "./routes/index";

/**
 * The server.
 *
 * @class Server
 */
class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //configure routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    let loadDeviceInfo = new LoadDeviceInfo();
    loadDeviceInfo.update();

    setInterval(function() {
      let loadDeviceInfo = new LoadDeviceInfo();
      loadDeviceInfo.update();
      console.log("test");
    }, 30000);
    //let worker = new Worker("");
    //configure jade
    //this.app.set("views", path.join(__dirname, "views"));
    //this.app.set("view engine", "jade");

    //mount logger
    //this.app.use(logger("dev"));

    //mount json form parser
    //this.app.use(bodyParser.json());

    //mount query string parser
    //this.app.use(bodyParser.urlencoded({ extended: true }));

    //add static paths
    //this.app.use("/docs", express.static(path.join(__dirname, "docs")));

    // catch 404 and forward to error handler
    /*this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      var error = new Error("Not Found");
      err.status = 404;
      next(err);
    });*/
  }

  /**
   * Configure routes
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    //get router
    //let router: express.Router;
    //router = express.Router();

    //create routes
    //var index: indexRoute.Index = new indexRoute.Index();

    //home page
    //router.get("/", index.index.bind(index.index));

    //use router middleware
    //this.app.use(router);

    var spec = fs.readFileSync("docs/swagger.yaml", "UTF-8");
    var swaggerDoc = jsYaml.safeLoad(spec);
    console.log(swaggerDoc);
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