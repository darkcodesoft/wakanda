import express from 'express'
import ModelController from './ModelController'
import EventService from '../services/event'

/**
 *
 *
 * @class EventController
 * @extends {ModelController}
 */
class EventController extends ModelController {

    /**
     *
     *
     * @protected
     * @memberof EventController
     */
    public Service = EventService

    /**
     *
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {Promise<void>}
     * @memberof EventController
     */
    public async find (req: express.Request, res: express.Response): Promise<void> {
        const options: any = {}
        let match: any|undefined = undefined

        if(req.query.active) {
            match = match || {}
            match.active = req.query.active == '1'
        }

        if(req.query.lte || req.query.gte) {
            match = match || {}
            const start: any = {}

            if(req.query.gte) {
                start.$gte = new Date(req.query.gte).toISOString()
            }

            if(req.query.lte) {
                start.$lte = new Date(req.query.lte).toISOString()
            }

            match.start = start
        }

        if(match) {
            options.match = match
        }

        return super.find(req, res, options)
    }
}

export default new EventController
