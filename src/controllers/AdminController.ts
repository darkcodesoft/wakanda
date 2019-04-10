import { User, UserModel } from '../models/User'
import { Event, EventModel } from '../models/Event'
import express from 'express'
import { jsonHttpError, parseFields } from '../lib/http'
import { fork } from 'child_process'
import { join } from 'path'

/**
 *
 * @param req
 * @param res
 */
export async function dashboard(req: express.Request, res: express.Response): Promise<void> {
    const eventCount = await Event.count({})
    const userCount = await User.count({})
    // should be getting data from Jobs Model
    res.send({
        'updated': new Date(),
        'models':[
            {
                'name': 'user',
                'count': userCount,
            },
            {
                'name': 'event',
                'count': eventCount,
            }
        ]
    })
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function event(req: express.Request, res: express.Response): Promise<void> {
    if(req.params.id) {
        try {
            const event = await Event.findOne({ _id: req.params.id })
            res.send(event)
        } catch(error) {
            jsonHttpError(res, { code: 404, data: error })
        }
    } else {
        const now = new Date().toISOString()
        const fields = req.query.fields ? parseFields(req.query.fields) : {}
        const limit = req.query.limit ? parseInt(req.query.limit) : 25
        const page = req.query.page ? parseInt(req.query.page) : 1
        const skip = limit * (page - 1)
        const sort = req.query.sort ? req.query.sort : 'start'
        const search = req.query.search ? req.query.search.toString() : null

        let query =  {}
        if(!!search) {
            query = {$text: {$search: search}}
        }

        Event.find(query).
            skip(skip).
            limit(limit).
            sort(sort).
            select(fields).
            where({}).
            exec().
            then((events) => {
                res.send(events)
            }).
            catch((error) => {
                jsonHttpError(res, { code: 404, data: error })
            })
    }
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function user(req: express.Request, res: express.Response): Promise<void> {
    if(req.params.id) {
        try {
            const user = await User.findOne({ _id: req.params.id })
            res.send(user)
        } catch(error) {
            jsonHttpError(res, { code: 404, data: error })
        }
    } else {
        const fields = { name: 1 }
        const limit = req.query.limit ? parseInt(req.query.limit) : 25
        const page = req.query.page ? parseInt(req.query.page) : 1
        const skip = limit * (page - 1)
        const sort = 'name'
        const search = req.query.search ? req.query.search.toString() : null

        let query =  {}
        if(!!search) {
            query = {$text: {$search: search}}
        }

        User.find(query).
            skip(skip).
            limit(limit).
            sort(sort).
            select(fields).
            where({}).
            exec().
            then((users) => {
                res.send(users)
            }).
            catch((error) => {
                jsonHttpError(res, { code: 404, data: error })
            })
    }
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function update(req: express.Request, res: express.Response): void {
    const process = fork(join(__dirname, '../../src/providers'), ['-r', 'ts-node/register'])
    console.log('Provider fetch started:' + new Date() )
    process.on('message', (msg) => {
        if(msg.status === 200) {
            console.log('Provider fetch completed:' + new Date())
        } else {
            console.log('Provider fetch error:' + new Date())
            console.log(msg)
        }
    })

    res.send({ message: 'porcess started' })
}