import { Model } from 'mongoose';
import { HttpResponseError } from '../lib/http';
import { EventModel } from '../models/Event';
import { UserModel } from '../models/User';
import {
  ApiResponseList,
  ApiResponseListData,
  ApiResponsePagination
} from '../interfaces/ApiResponse';

/**
 *
 *
 * @export
 * @interface ModelServiceInterface
 */
export interface ModelServiceInterface {
  find(options: any): Promise<ApiResponseList|HttpResponseError>
  findById(id: string): Promise<Model<EventModel|UserModel>|HttpResponseError>
  create(options: any): Promise<Model<EventModel|UserModel>|HttpResponseError>
  update(options: any): Promise<Model<EventModel|UserModel>|HttpResponseError>
  remove(id: string): Promise<boolean|HttpResponseError>
  count(): Promise<number|HttpResponseError>
}

/**
 *
 *
 * @export
 * @class ModelService
 * @implements {ModelServiceInterface}
 */
export default class ModelService implements ModelServiceInterface {
  /**
   *
   *
   * @protected
   * @type {Model<any>}
   * @memberof BaseService
   */
  protected Model?: Model<any> = undefined;

  /**
   *
   *
   * @protected
   * @type {number}
   * @memberof BaseService
   */
  protected baseLimit: number = 25

  /**
   *
   *
   * @protected
   * @type {number}
   * @memberof BaseService
   */
  protected basePage: number = 1

  /**
   *
   *
   * @protected
   * @type {number}
   * @memberof BaseService
   */
  protected baseDistance: number = 2 // in mile

  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof BaseService
   */
  protected baseSort: string = 'start'

  /**
   *
   * @param options
   * @returns Promise<ApiResponseList | HttpResponseError>
   */
  public async find (options: any): Promise<ApiResponseList|HttpResponseError> {
    try {
      const fields = options.fields || {};
      const match = options.match || {};
      const limit = options.limit || this.baseLimit;
      const page = options.page || this.basePage;
      const sort = options.sort || this.baseSort;
      const skip = limit * (page - 1);
      const search = options.search ? options.search.toString() : undefined;

      if (search) {
        match.$text = { $search: search };
      }

      if (!!options.lat && !!options.long) {
        const distance = parseFloat(options.distance ? options.distance : this.baseDistance) * 1609.34; // convert to meters
        const lat = parseFloat(options.lat);
        const long = parseFloat(options.long);

        match.location = {
          $nearSphere: {
            $maxDistance: distance,
            $geometry: {
              type: 'Point',
              coordinates: [long, lat]
            }
          }
        };
      }

      const items: Model<EventModel|UserModel>[]|HttpResponseError = await this.Model!.find({})
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select(fields)
        .where(match)
        .exec()
        .then((collection) => {
          return collection;
        })
        .catch((error) => {
          return { code: 404, data: error } as HttpResponseError;
        });

      const count = await this.count();
      const total = (typeof count === 'number' ? count : 0);
      const lastPage = Math.ceil(total / limit);
      const nextPage = (lastPage > page ? page + 1 : undefined);
      const previousPage = (page === 1 ? undefined : page - 1);
      const pagination: ApiResponsePagination = {
        count: (items instanceof Array ? items.length : 0),
        limit,
        skip,
        total,
        currentPage: page,
        nextPage,
        previousPage,
        lastPage
      };

      const data: ApiResponseListData = {
        items,
        pagination
      };

      const response: ApiResponseList = {
        status: (items instanceof Array ? 'success' : 'fail'),
        message: '',
        data
      };

      return response;
    } catch (error) {
      return { code: 500, data: error } as HttpResponseError;
    }
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Model<any>}
   */
  public async findById (id: string): Promise<Model<EventModel|UserModel>|HttpResponseError> {
    try {
      return await this.Model!.findOne({ _id: id });
    } catch (error) {
      return { code: 500, data: error } as HttpResponseError;
    }
  }

  /**
   *
   *
   * @param {*} options
   * @returns {(Model<any|HttpResponseError>)}
   * @memberof ModelService
   */
  public async create (options: any): Promise<Model<EventModel|UserModel>|HttpResponseError> {
    try {
      const model = new this.Model!(options);
      await model.save();
      return model;
    } catch (error) {
      return { code: 500, data: error } as HttpResponseError;
    }
  }

  /**
   *
   *
   * @param {*} options
   * @returns {(Model<any|HttpResponseError>)}
   * @memberof ModelService
   */
  public async update (options: any): Promise<Model<EventModel|UserModel>|HttpResponseError> {
    try {
      const id = options.id;
      const model = await this.Model!.findByIdAndUpdate(id, options);
      return model;
    } catch (error) {
      return { code: 500, data: error } as HttpResponseError;
    }
  }

  /**
   *
   *
   * @param {string} id
   * @returns {(Promise<boolean|HttpResponseError>)}
   * @memberof ModelService
   */
  public async remove (id: string): Promise<boolean|HttpResponseError> {
    try {
      await this.Model!.findByIdAndDelete({ _id: id });
      return true;
    } catch (error) {
      return { code: 500, data: error } as HttpResponseError;
    }
  }

  /**
   *
   *
   * @returns {Promise<number>}
   * @memberof BaseService
   */
  public async count (): Promise<number|HttpResponseError> {
    try {
      return await this.Model!.estimatedDocumentCount();
    } catch (error) {
      return { code: 500, data: error } as HttpResponseError;
    }
  }
}
