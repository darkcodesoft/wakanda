import BaseProvider from '../base'
import { Factory } from './factory'
import { Item, EventBriteEvent } from '../../interfaces/Event'

/**
 *
 *
 * @class TicketMaster
 * @extends {BaseProvider}
 */
class EventBrite extends BaseProvider {

    /**
     *
     *
     * @protected
     * @memberof TicketMaster
     */
    protected id = 'eventbrite'

    /**
     *
     *
     * @protected
     * @memberof TicketMaster
     */
    protected Factory = Factory

    /**
     *
     *
     * @protected
     * @memberof TicketMaster
     */
    protected api = 'https://www.eventbriteapi.com/v3/events/search/'

    /**
     *
     *
     * @private
     * @memberof TicketMaster
     */
    private token = 'BHKOZKMHPLU2XIR7AT3U'

    /**
     *
     *
     * @private
     * @memberof TicketMaster
     */
    private expand = [
        'venue',
        'organizer',
        'category',
        'subcategory',
        'ticket_classes',
    ]

    /**
     *
     *
     * @private
     * @memberof TicketMaster
     */
    private location = 'nyc'

    /**
     *
     *
     * @private
     * @memberof TicketMaster
     */
    private distance = '300km'

    /**
     *
     *
     * @protected
     * @memberof TicketMaster
     */
    protected limit = 100 // 100

    /**
     *
     *
     * @protected
     * @memberof TicketMaster
     */
    protected configureUrl(): void {
        super.configureUrl()
        this.url!.searchParams.set('token', this.token)
        this.url!.searchParams.set('expand', this.expand.join(','))
        this.url!.searchParams.set('location.address', this.location)
        this.url!.searchParams.set('location.within', this.distance)
        this.url!.searchParams.set('sort_by', 'date')
    }

    /**
     *
     *
     * @protected
     * @param {URL} url
     * @param {*} response
     * @memberof EventBrite
     */
    protected successHandler(url: URL, response: any): void {
        const events: EventBriteEvent[] = response.events
        const collection: Item[] = this.Factory!.collect(events)
        this.succeeded.push(...collection)
    }
}

export default new EventBrite
