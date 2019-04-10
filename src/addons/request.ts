/**
 * User native c++ request addon
 */
const request = require('../../build/Release/request.node')

/**
 * Define NativeRequest namespace
 */
export namespace NativeRequest {

    /**
     *
     *
     * @export
     * @interface Client
     */
    export interface Client {

        /**
         *
         *
         * @param {string} url
         * @returns {string}
         * @memberof Client
         */
        request(url: string): string
    }

    /**
    * export native Client object
    */
    export const Client: NativeRequest.Client = new request.Client
}
