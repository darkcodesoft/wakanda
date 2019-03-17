import { Mongoose } from 'mongoose'
import { Event } from '../models/Event'
import express from 'express'
import { fork } from 'child_process'
import { join } from 'path'

/**
 *
 *
 * @export
 * @class EventController
 */
export default class EventController {

    private static limit: number = 25
    private static page: number = 1
    private static sort: string = 'start'
    private static instance?: EventController|null = null

    /**
     *
     *
     * @static
     * @returns {EventController}
     * @memberof EventController
     */
    public static static(): EventController {
        if(EventController.instance === null) {
            EventController.instance = new EventController
            return EventController.instance
        }
        return EventController.instance!;
    }

    /**
     *
     *
     * @param {express.Request} req
     * @param {express.Response} response
     * @memberof EventController
     */
    public find(req: express.Request, res: express.Response): void {
        const now = new Date().toISOString()
        const fields = req.query.fields ? EventController.parseFields(req.query.fields) : {}
        const limit = req.query.limit ? parseInt(req.query.limit) : EventController.limit
        const page = req.query.page ? parseInt(req.query.page) : EventController.page
        const skip = limit * (page - 1)
        const sort = req.query.sort ? req.query.sort : EventController.sort

        Event.find({}).
            skip(skip).
            limit(limit).
            sort(sort).
            select(fields).
            where({ active: true, start: { $gte: now } }).
            exec((error:any, events: Event[]) => {
                res.send(events)
            })
    }

    /**
     *
     *
     * @param {express.Request} req
     * @param {express.Response} response
     * @memberof EventController
     */
    public detail(req: express.Request, res: express.Response): void {
        Event.findOne({ _id: req.params.id }, (error:any, events: Event[]) => {
            res.send(events)
        })
    }

    /**
     * Admin fetch method. Load providers to fetch event to update the database in child process
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @memberof EventController
     */
    public fetch(req: express.Request, res: express.Response): void {
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

    /**
     *
     *
     * @private
     * @static
     * @param {string} query
     * @returns {*}
     * @memberof EventController
     */
    private static parseFields(query: string): any {
        const fields: any = {}
        const array: string[] = query.replace(/\s/g,'').split(',')
        const size = array.length
        let field: string
        let i = 0

        for( ; i < size; i++ ) {
            field = array[i]
            fields[field] = 1;
        }

        return fields
    }
}