import ModelService from "./model"
import { Event } from '../models/Event'

class EventService extends ModelService {

    /**
     *
     *
     * @protected
     * @memberof EventService
     */
    protected Model = Event
}

export default new EventService()