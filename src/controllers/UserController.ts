import { User, UserModel } from '../models/User'
import express from 'express'
import { jsonHttpError } from '../lib/http'

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function find(req: express.Request, res: express.Response): void {
    res.send(req.session)
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
export async function create(req: express.Request, res: express.Response): Promise<void> {
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
export async function detail(req: express.Request, res: express.Response): Promise<void> {
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
export async function update(req: express.Request, res: express.Response): Promise<void> {
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
export async function remove(req: express.Request, res: express.Response): Promise<void> {

    try {
        await User.findByIdAndDelete({ _id: req.body.id})
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
 */
export function loginForm(req: express.Request, res: express.Response): void  {
    const timestamp = new Date()
    res.render('user/login', { timestamp: timestamp })
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {(Promise<void|boolean>)}
 */
export async function login(req: express.Request, res: express.Response): Promise<void|boolean>  {
    const email = req.body.email
    const password = req.body.password
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    let user: UserModel|null

    if(!email || !password) {
        jsonHttpError(res, { code: 400, message: 'Invalid email or password.' })
        return false
    }

    try {
        user = await User.findOne({ email: email })
        user!.comparePassword(password, async (error: any, isMatch?: boolean) => {
            if(error) jsonHttpError(res, { code: 500, data: error })
            else if(isMatch) {

                try {
                    await User.updateOne({ _id: user!.id }, { lastLogin: new Date(), location: ip, active: true })
                    user = await User.findOne({ _id: user!.id })
                    req.session!.userId = user!.id
                    res.send(user)
                } catch (error) {
                    jsonHttpError(res, { code: 500, data: error })
                }
            }
            else jsonHttpError(res, { code: 404, message: 'User not found' })
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
export async function logout(req: express.Request, res: express.Response): Promise<void> {
    req.session!.destroy((error) => {
        if(error) {
            jsonHttpError(res, { code: 500, data: error })
        } else {
            res.send({ message: 'Successfully logged out.' })
        }
    })
}