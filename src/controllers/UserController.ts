import express from 'express'
import ModelController from './ModelController'
import UserService from '../services/user'
import { jsonHttpError } from '../lib/http'

/**
 *
 *
 * @class EventController
 * @extends {ModelController}
 */
class UserController extends ModelController {

    /**
     *
     *
     * @protected
     * @memberof EventController
     */
    public Service = UserService

    /**
     *
     *
     * @export
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {Promise<void>}
     */
    public async create(req: express.Request, res: express.Response): Promise<void> {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const options = { name: name,  email: email, password: password, location: ip }
        req.body = undefined
        return super.create(req, res, options)
    }

    /**
     *
     *
     * @export
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {(Promise<void|boolean>)}
     */
    public async login(req: express.Request, res: express.Response): Promise<void|boolean> {
        const email = req.body.email
        const password = req.body.password
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const ipString = Array.isArray(ip) ? ip[0] : ip;

        if(email && password && ipString && req.headers.host) {
            const result = await UserService.login(email, password, ipString, req.headers.host!);
            if ( result && 'error' in result ) jsonHttpError(res, result)
            else res.send(result)
        } else {
            jsonHttpError(res, { code: 400, data: { message: 'Invalid credentials.' }})
        }
    }

    /**
     * Auth middleware
     *
     * @param req
     * @param res
     * @param next
     */
    public auth(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const host = req.headers.host
        const id = req.headers['x-access-id']! || null
        const token = req.headers['x-access-token']! || null
        const tokenString = Array.isArray(token) ? token[0] : token
        const idString = Array.isArray(id) ? id[0] : id

        if(host && idString && tokenString && UserService.auth(tokenString, idString, host) ) next()
        else jsonHttpError(res, { code: 500, data: { message: 'Failed to authenticate token.' }})
    }
}

export default new UserController
