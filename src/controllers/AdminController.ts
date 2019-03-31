import { User, UserModel } from '../models/User'
import { Event, EventModel } from '../models/Event'
import express from 'express'
import { jsonHttpError } from '../lib/http'
import { NextFunction } from 'connect';

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function dashboard(req: express.Request, res: express.Response): Promise<void> {
    const eventCount = await Event.count({})
    const userCount = await User.count({})

    res.render('admin/dashboard', {
        pageTitle: 'Dashboard',
        ip: req.session!.userIp,
        eventCount: eventCount,
        userCount: userCount
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
            res.render('admin/event', { event: event, pageTitle: event!.name })
        } catch(error) {
            jsonHttpError(res, { code: 404, data: error })
        }
    } else {
        const now = new Date().toISOString()
        const fields = { name: 1 }
        const limit = req.query.limit ? parseInt(req.query.limit) : 25
        const page = req.query.page ? parseInt(req.query.page) : 1
        const skip = limit * (page - 1)
        const sort = req.query.sort ? req.query.sort : 'start'
        const count = await Event.count({})

        Event.find({}).
            skip(skip).
            limit(limit).
            sort(sort).
            select(fields).
            where({}).
            exec().
            then((events) => {
                res.render('admin/events', {
                    pageTitle: 'Events',
                    ip: req.session!.userIp,
                    count: count,
                    collection: events,
                    page: page,
                    limit: limit,
                    skip: skip
                })
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

    // const eventCount = await Event.count({})
    // const userCount = await User.count({})

    // res.render('admin/user', {
    //     pageTitle: 'Users',
    //     ip: req.session!.userIp,
    //     collection: collection
    // })
}