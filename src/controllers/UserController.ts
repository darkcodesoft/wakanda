import { Mongoose } from 'mongoose'
import { User, UserModel } from '../models/User'
import express from 'express'

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function find(req: express.Request, res: express.Response): void {

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
    const user = await createUser({ name: name,  email: email, password: password})

    res.send({ result: user })
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
        res.status(404).send(error)
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

    if(!email || !password) {
        res.status(500).send({ message: 'Email and/or password invalid.' })
        return false
    }

    try {
        const user = await User.findOne({ email: email })
        user!.comparePassword(password, (error: any, isMatch?: boolean) => {
            if(error) res.status(500).send(error)
            else if(isMatch) {
                // start user session
                res.status(200).send(user)
            }
            else res.status(404).send('User not found.')
        })
    } catch (error) {
        res.status(404).send(error)
    }
}

/**
 *
 *
 * @export
 * @param {User} creds
 * @returns {Promise<UserModel>}
 */
export async function createUser(creds: User): Promise<UserModel> {
    const user = new User({ name: creds.name,  email: creds.email, password: creds.password})
    try {
        const store = await user.save()
        return user
    } catch (error) {
        return error
    }
}