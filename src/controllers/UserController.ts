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
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const user = new User({ name: name,  email: email, password: password, location: ip })

    try {
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
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
        res.status(200).send(user)
    } catch(error) {
        res.status(404).send(error)
    }
}

// update

// delete

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
        res.status(500).send({ message: 'Email or password invalid.' })
        return false
    }

    try {
        user = await User.findOne({ email: email })
        user!.comparePassword(password, async (error: any, isMatch?: boolean) => {
            if(error) res.status(500).send(error)
            else if(isMatch) {
                // @todo: set user session here
                try {
                    await User.updateOne({ _id: user!.id }, { lastLogin: new Date(), location: ip, active: true })
                    user = await User.findOne({ _id: user!.id })
                    res.status(200).send(user)
                } catch (error) {
                    res.status(500).send(error)
                }
            }
            else res.status(404).send('User not found.')
        })
    } catch (error) {
        res.status(404).send(error)
    }
}