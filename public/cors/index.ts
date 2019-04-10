import cors from 'cors'
import { domains } from './config.json'

var corsOptions = {
  origin: function (origin:string, callback:any) {
    if (domains.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

/**
 * Enable cors
 * @return cors config callback
 */
export function enableCors() {
    return cors(corsOptions)
}