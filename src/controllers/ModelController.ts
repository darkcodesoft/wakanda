import express from 'express';
import { jsonHttpError, parseFields } from '../lib/http';
import { ModelServiceInterface } from '../services/model';

/**
 *
 *
 * @export
 * @class ModelController
 * @implements {ModelControllerInterface}
 */
export default class ModelController {
  /**
   *
   *
   * @protected
   * @type {ModelServiceInterface}
   * @memberof ModelController
   */
  public Service?: ModelServiceInterface = undefined

  /**
   * Use arrow functions in controller class methods to perserve `this` context
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @returns {Promise<void>}
   * @memberof ModelController
   */
  public async find (req: express.Request, res: express.Response, _options?: any): Promise<void> {
    if (req.params.id) {
      const model = await this.Service!.findById(req.params.id);
      return this.response(res, model);
    } else if (req.query || _options) {
      const options = { ...req.query, ..._options };

      if (options.fields) options.fields = parseFields(options.fields);
      if (options.limit) options.limit = parseInt(options.limit);
      if (options.page) options.page = parseInt(options.page);

      const collection = await this.Service!.find(options);
      return this.response(res, collection);
    } else {
      this.throw(res, 'Invalid request.');
    }
  }

  /**
   * Use arrow functions in controller class methods to perserve `this` context
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @returns {Promise<void>}
   * @memberof ModelController
   */
  public async update (req: express.Request, res: express.Response, _options?: any): Promise<void> {
    if (req.params.id) {
      const options = { ...req.body, ..._options };
      options.id = req.params.id;
      const model = await this.Service!.update(options);
      return this.response(res, model);
    } else {
      this.throw(res, 'Invalid request. No ID speicified.');
    }
  }

  /**
   *
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @returns {Promise<void>}
   * @memberof ModelController
   */
  public async create (req: express.Request, res: express.Response, _options?: any): Promise<void> {
    if (req.body || _options) {
      const options = { ...req.body, ..._options };
      const model = await this.Service!.create(options);
      return this.response(res, model);
    } else {
      this.throw(res, 'Invalid request. No ID specified.');
    }
  }

  /**
   *
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @returns {Promise<void>}
   * @memberof ModelController
   */
  public async remove (req: express.Request, res: express.Response): Promise<void> {
    if (req.body.id) {
      const deleted = await this.Service!.remove(req.body.id);
      return this.response(res, deleted);
    } else {
      this.throw(res, 'Invalid request. No ID specified.');
    }
  }

  /**
   *
   *
   * @protected
   * @param {express.Response} res
   * @param {*} result
   * @memberof ModelController
   */
  protected response (res: express.Response, result:any) : void {
    if ('error' in result) {
      jsonHttpError(res, result);
    } else {
      res.send(result);
    }
  }

  /**
   *
   *
   * @protected
   * @param {express.Response} res
   * @param {string} message
   * @returns
   * @memberof ModelController
   */
  protected throw (res: express.Response, message: string, code: number = 400) {
    return jsonHttpError(res, { code: code, data: { message: message } });
  }
}
