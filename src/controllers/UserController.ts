import { User, UserModel } from '../models/User'
import express from 'express'
import { jsonHttpError } from '../lib/http'
import { NextFunction } from 'connect';
// import jwt from 'jsonwebtoken';
import { JWTSign, JWTVerify, JWTDecode, JWTPayload } from '../services/jwt';

const base_limit: number = 25
const base_page: number = 1
const base_sort: string = 'start'

export {
    find,
    create,
    detail,
    update,
    remove,
    login,
    logout,
    auth
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
function find(req: express.Request, res: express.Response): void {
    const limit = req.query.limit ? parseInt(req.query.limit) : base_limit
    const page = req.query.page ? parseInt(req.query.page) : base_page
    const skip = limit * (page - 1)
    const sort = req.query.sort ? req.query.sort : base_sort

    User.find({}).
        skip(skip).
        limit(limit).
        sort(sort).
        exec().
        then((users) => {
            res.send(users)
        }).
        catch((error) => {
            jsonHttpError(res, { code: 404, data: error })
        })
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
async function create(req: express.Request, res: express.Response): Promise<void> {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const user = new User({ name: name,  email: email, password: password, location: ip })

    try {
        await user.save()
        res.send(user)
    } catch (error) {
        jsonHttpError(res, { code: 500, data: error })
    }
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
async function detail(req: express.Request, res: express.Response): Promise<void> {
    try {
        const user = await User.findOne({ _id: req.params.id })
        res.send(user)
    } catch(error) {
        jsonHttpError(res, { code: 404, data: error })
    }
}

/**
 *
 * @param req
 * @param res
 */
async function update(req: express.Request, res: express.Response): Promise<void> {
    if(req.session) {
        try {
            const id = req.body.id ? req.body.id : req.session!.id
            const user = await User.findByIdAndUpdate(id, req.body)
            res.send(user)
        } catch(error) {
            jsonHttpError(res, { code: 500, data: error })
        }
    } else {
        jsonHttpError(res, { code: 404 })
    }
}

/**
 * WARNING: we don't do this. have it just in case
 *
 * @param req
 * @param res
 */
async function remove(req: express.Request, res: express.Response): Promise<void> {
    try {
        await User.findByIdAndDelete({ _id: req.body.id })
        res.send({ message: 'Deleted' })
    } catch(error) {
        jsonHttpError(res, { code: 500, data: error })
    }
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {(Promise<void|boolean>)}
 */
async function login(req: express.Request, res: express.Response): Promise<void|boolean>  {
    const email = req.body.email
    const password = req.body.password
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    let user: UserModel|null

    if(!email || !password) {
        jsonHttpError(res, { code: 400, data: { message: 'Invalid email or password.' }})
        return false
    }

    try {
        user = await User.findOne({ email: email })
        user!.comparePassword(password, async (error: any, isMatch?: boolean) => {
            if(error) jsonHttpError(res, { code: 500, data: error })
            else if(isMatch) {

                try {
                    await User.updateOne({ _id: user!.id }, { lastLogin: new Date(), location: ip, active: true })
                    user = await User.findOne({ _id: user!.id }).select({ password: 0, active: 0, created: 0, __v: 0 })
                    if(user && req.headers.host)  {
                        const JWTToken = JWTSign({ _id: user.id, host: req.headers.host! })
                        res.send({
                            success: true,
                            user: user,
                            token: JWTToken,
                        })
                    }
                } catch (error) {
                    jsonHttpError(res, { code: 500, data: error })
                }
            }
            else jsonHttpError(res, { code: 404, data: { message: 'User not found.' }})
        })
    } catch (error) {
        jsonHttpError(res, { code: 404, data: error })
    }
}

/**
 *
 * @param req
 * @param res
 */
async function logout(req: express.Request, res: express.Response): Promise<void> {
    req.session!.destroy((error) => {
        if(error) {
            jsonHttpError(res, { code: 500, data: error })
        } else {
            res.send({ logout: true })
        }
    })
}

/**
 * Auth middleware
 *
 * @param req
 * @param res
 * @param next
 */
function auth(req: express.Request, res: express.Response, next: NextFunction): void {
    const token = req.headers['x-access-token']! || null
    const id = req.headers['x-access-id']! || null
    const host = req.headers.host
    console.log(token)
    // console.log(req)

    if(!token || !id || !host) return jsonHttpError(res, { code: 401, data: { message: 'No token provided.' }})

    const verified = JWTVerify(Array.isArray(token) ? token[0] : token, Array.isArray(id) ? id[0] : id, host)

    if(verified) next()
    else jsonHttpError(res, { code: 500, data: { message: 'Failed to authenticate token.' }})
}