import { Model } from "mongoose"
import { HttpResponseError } from '../lib/http'
import { EventModel } from '../models/Event'
import { UserModel } from '../models/User'

/*
 *
 * @export
 * @interface ApiResponseList
 */
export declare interface ApiResponseList {
    status: string
    message: string
    data: ApiResponseListData
}

/*
 *
 * @export
 * @interface ApiResponseItem
 */
export declare interface ApiResponseItem {
    status: string
    message: string
    data: ApiResponseItemData
}

/*
 *
 * @export
 * @interface ApiResponseListData
 */
export declare interface ApiResponseListData {
    items: Model<EventModel|UserModel>[]|HttpResponseError
    pagination: ApiResponsePagination
}

/*
 *
 * @export
 * @interface ApiResponseItemData
 */
export declare interface ApiResponseItemData {
    item: EventModel|UserModel
    pagination: ApiResponsePagination
}

/*
 *
 * @export
 * @interface ApiResponsePagination
 */
export declare interface ApiResponsePagination {
    count: number
    limit: number
    skip: number
    total: number
    current_page: number
    next_page?: number
    previous_page?: number
    last_page?: number
}
