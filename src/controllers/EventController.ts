import {Event} from '../models/Event'
import express from 'express'
import { Mongoose } from 'mongoose'
/**
 *
 *
 * @export
 * @class EventController
 */
export default class EventController {

    private static limit:number = 5
    private static instance?:EventController|null = null

    /**
     *Creates an instance of EventController.
     * @memberof EventController
     */
    constructor() {}

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
    public index(req: express.Request, res: express.Response): void {
        const limit = req.query.limit ? parseInt(req.query.limit) : EventController.limit
        const now = new Date().toISOString()

        Event.find({}).
            limit(limit).
            sort('start').
            select({ name: 1, start: 1 }).
            // select({ name: 1, location: 1, images: 1, eventId: 1, start: 1}).
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
     * Admin fetch method. Load providers to fetch event to update the database
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @memberof EventController
     */
    public fetch(req: express.Request, res: express.Response): void {
        // ticket mastere
        const TicketMaster = require('../../src/providers/TicketMaster')
        let ticketmaster = TicketMaster.static()
        ticketmaster.fetch()

        // eventbrite
        const EventBrite = require('../../src/providers/EventBrite')
        let eventbrite = EventBrite.static()
        eventbrite.fetch()
    }
}

