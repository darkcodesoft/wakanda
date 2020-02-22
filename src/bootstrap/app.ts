import Server from '../../public/server';
import Task from '../../public/task';
import express from 'express';
import createError, { HttpError } from 'http-errors';
import { jsonHttpError } from '../lib/http';
import routes from '../../public/routes/';

/**
 *
 *
 * @class App
 */
export default class App {
  /**
   * static instance
   */
  private static instance?:App|null = null;

  /**
   * server object
   */
  public server:Server

  /**
   * Task object
   */
  public task:Task

  /**
   *
   *
   * @static
   * @returns {App}
   * @memberof App
   */
  public static static (): App {
    if (App.instance === null) {
      App.instance = new App();
    }
    return App.instance!;
  }

  /**
   *Creates an instance of App.
   * @memberof App
   */
  constructor () {
    this.server = Server.static();
    this.task = Task.static();
    this.setupDefaultApplicationRoutes();
  }

  /**
   * Setup default application routes
   *
   * @private
   * @memberof App
   */
  private setupDefaultApplicationRoutes (): void {
    // Mount app routes
    this.server.router.use('/api/v1/', routes);

    // HTTP errors handlers
    // 404
    this.server.router.use((req:express.Request, res: express.Response, next:express.NextFunction) => {
      next(createError(404));
    });

    // 500s
    this.server.router.use((err:HttpError, req:express.Request, res:express.Response, next:express.NextFunction) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      jsonHttpError(res, { code: (err.status || 500), data: err });
    });
  }

  /**
   * Application init method
   *
   * @returns boolean
   * @memberof App
   */
  public start (): boolean {
    try {
      return this.task.start() && this.server.start();
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
