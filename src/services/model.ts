import { Model } from "mongoose"
import { HttpResponseError } from '../lib/http'

/**
 *
 *
 * @export
 * @interface ModelServiceInterface
 */
export interface ModelServiceInterface {
    find(options: any): Promise<Model<any>[] | HttpResponseError>
    findById(id: string): Promise<Model<any>|HttpResponseError>
    create(options: any): Model<any|HttpResponseError>
    update(options: any): Model<any|HttpResponseError>
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
    protected base_limit: number = 25

    /**
     *
     *
     * @protected
     * @type {number}
     * @memberof BaseService
     */
    protected base_page: number = 1

    /**
     *
     *
     * @protected
     * @type {string}
     * @memberof BaseService
     */
    protected base_sort: string = 'start'

    /**
     *
     * @param options
     * @returns Promise<Model<any>[] | HttpResponseError>
     */
    public async find(options: any): Promise<Model<any>[] | HttpResponseError> {
        try {
            const fields = options.fields || {}
            const match = options.match || {}
            const limit = options.limit || this.base_limit
            const page = options.page || this.base_page
            const sort = options.sort || this.base_sort
            const skip = limit * (page - 1)
            const search = options.search ? options.search.toString() : undefined

            if(!!search) {
                match.$text = { $search: search }
            }

            return this.Model!.find({}).
                skip(skip).
                limit(limit).
                sort(sort).
                select(fields).
                where(match).
                exec().
                then((collection) => {
                    return collection;
                }).
                catch((error) => {
                    return { code: 404, data: error } as HttpResponseError
                })
        } catch(error) {
            return { code: 500, data: error } as HttpResponseError
        }
    }

    /**
     *
     *
     * @param {string} id
     * @returns {Model<any>}
     */
    public async findById(id: string): Promise<Model<any>|HttpResponseError> {
        try {
            return await this.Model!.findOne({ _id: id })
        } catch(error) {
            return { code: 500, data: error } as HttpResponseError
        }
    }

    /**
     *
     *
     * @param {*} options
     * @returns {(Model<any|HttpResponseError>)}
     * @memberof ModelService
     */
    public async create(options: any): Model<any|HttpResponseError> {
        try {
            const model = new this.Model!(options)
            await model.save()
            return model
        } catch(error) {
            return { code: 500, data: error } as HttpResponseError
        }
    }

    /**
     *
     *
     * @param {*} options
     * @returns {(Model<any|HttpResponseError>)}
     * @memberof ModelService
     */
    public async update(options: any): Model<any|HttpResponseError> {
        try {
            const id = options.id
            const model = await this.Model!.findByIdAndUpdate(id, options.body)
            return model
        } catch(error) {
            return { code: 500, data: error } as HttpResponseError
        }
    }

    /**
     *
     *
     * @param {string} id
     * @returns {(Promise<boolean|HttpResponseError>)}
     * @memberof ModelService
     */
    public async remove(id: string): Promise<boolean|HttpResponseError> {
        try {
            await this.Model!.findByIdAndDelete({ _id: id })
            return true
        } catch(error) {
            return { code: 500, data: error } as HttpResponseError
        }
    }

    /**
     *
     *
     * @returns {Promise<number>}
     * @memberof BaseService
     */
    public async count(): Promise<number|HttpResponseError> {
        try {
            return await this.Model!.estimatedDocumentCount()
        } catch(error) {
            return { code: 500, data: error } as HttpResponseError
        }
    }
}
