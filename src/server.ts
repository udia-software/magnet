import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");

import {IModel} from "./models/model";
import {IUserModel} from "./models/user";
import {userSchema} from "./schemas/user";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  private model: IModel; //an instance of IModel

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {Server} Returns the newly created server instance.
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
    // instance defaults
    this.model = <IModel> Object(); //initialize this to an empty IModel object

    // create Express application
    this.app = express();

    // configure application
    this.config();

    // add route for application and api
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    const MONGODB_CONNECTION: string = "mongodb://localhost:27017/magnet";

    // add static paths
    // noinspection TypeScriptValidateTypes
    this.app.use(express.static(path.join(__dirname, "public")));

    // mount logger
    // noinspection TypeScriptValidateTypes
    this.app.use(logger("dev"));

    // mount json form parser
    // noinspection TypeScriptValidateTypes
    this.app.use(bodyParser.json());

    // mount query string parser
    // noinspection TypeScriptValidateTypes
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // mount cookie parker
    // noinspection TypeScriptValidateTypes
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    // mount override
    // noinspection TypeScriptValidateTypes
    this.app.use(methodOverride());

    // use q promises
    global.Promise = require("q").Promise;
    mongoose.Promise = global.Promise;

    // connect to mongoose
    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

    // create models
    this.model.user = connection.model<IUserModel>("User", userSchema);

    // catch 404 and forward to error handler
    // noinspection TypeScriptValidateTypes
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

    // error handling
    // noinspection TypeScriptValidateTypes
    this.app.use(errorHandler());
  }


  private routes() {
    let router: express.Router;
    router = express.Router();

    router.route("/")
      .get((req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, "client", "index.html"));
      });

    router.route("/systemjs.config.js")
      .get((req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, "client", "systemjs.config.js"));
      });

    // use router middleware
    // noinspection TypeScriptValidateTypes
    this.app.use(router);

    // Serve the angular 2 application
    // noinspection TypeScriptValidateTypes
    this.app.use("/app", express.static(path.join(__dirname, "client", "app")));
  }
}