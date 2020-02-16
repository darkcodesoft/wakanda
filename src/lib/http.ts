import express from 'express';

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
export function jsonHttpError (response: express.Response, payload: HttpResponseError) {
  payload.error = payload.error ? payload.error : true;
  response.status(payload.code).send(payload);
  console.log(payload);
}

/**
 *
 *
 * @param {string} query
 * @returns {*}
 */
export function parseFields (query: string): any {
  const fields: any = {};
  const array: string[] = query.replace(/\s/g, '').split(',');
  const size = array.length;
  let field: string;
  let i = 0;

  for (; i < size; i++) {
    field = array[i];
    fields[field] = 1;
  }

  return fields;
}
