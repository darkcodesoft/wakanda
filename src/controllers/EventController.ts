import { Event } from '../models/Event'
import express from 'express'
import { jsonHttpError, parseFields } from '../lib/http'

const base_limit: number = 25
const base_page: number = 1
const base_sort: string = 'start'

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
export async function find(req: express.Request, res: express.Response): Promise<void> {
    const now = new Date().toISOString()
    const fields = req.query.fields ? parseFields(req.query.fields) : {}
    const limit = req.query.limit ? parseInt(req.query.limit) : base_limit
    const page = req.query.page ? parseInt(req.query.page) : base_page
    const skip = limit * (page - 1)
    const sort = req.query.sort ? req.query.sort : base_sort

    Event.find({}).
        skip(skip).
        limit(limit).
        sort(sort).
        select(fields).
        where({ active: true, start: { $gte: now } }).
        exec().
        then((events) => {
            res.send(events)
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
export async function detail(req: express.Request, res: express.Response): Promise<void> {
    try {
        const event = await Event.findOne({ _id: req.params.id })
        res.send(event)
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
            const id = req.params.id
            const event = await Event.findByIdAndUpdate(id, req.body)
            res.send(event)
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
        await Event.findByIdAndDelete({ _id: req.body.id })
        res.send({ message: 'Deleted' })
    } catch(error) {
        jsonHttpError(res, { code: 500, data: error })
    }
}