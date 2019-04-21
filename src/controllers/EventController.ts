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
        const now = new Date().toISOString()
        const options = {
            match: { active: true, start: { $gte: now } }
        }
        return super.find(req, res, options)
    }
}

export default new EventController