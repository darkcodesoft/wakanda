import express from 'express'

/**
 *
 *
 * @export
 * @interface HttpResponseError
 */
export interface HttpResponseError {
    error?: boolean
    code: number
    message?: string
    data?: any
}

/**
 *
 *
 * @export
 * @param {express.Response} response
 * @param {HttpResponseError} payload
 */
export function jsonHttpError(response: express.Response, payload: HttpResponseError) {
    payload.error = payload.error ? payload.error : true
    response.status(payload.code).send(payload)
    console.log(payload)
}