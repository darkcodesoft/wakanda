import {
    Item,
    Source,
    Image,
    TicketClass,
    EventBriteEvent,
    EventBriteVenue
} from '../../interfaces/Event'

/**
 * Define Event Factory namepace
 * This namepace contains functions that converts Provider response
 * data into Event model types
 */
export namespace Factory {

    /**
     * Configure event item id
     *
     * @export
     * @param {string} sourceItemId
     * @param {string} source
     * @returns {string}
     */
    export function makeId(sourceItemId: string, source: string): string {
        return `${source}__${sourceItemId}`
    }

    /**
     * Parse EventBriteEvent array into Event Item array
     *
     * @export
     * @param {EventBriteEvent[]} events
     * @returns {Item[]}
     */
    export function collect(events: EventBriteEvent[]): Item[] {
        const collection: Item[] = []
        let event: EventBriteEvent
        let i = 0
        const max = events.length

        for( ; i < max; i++ ) {
            event = events[i]
            if(!event.is_locked) {
                collection[i] = make(event)
            }
        }

        return collection
    }

    /**
     * Parse EventBriteEvent into Event Item model type
     *
     * @export
     * @param {EventBriteEvent} event
     * @returns {Item}
     */
    export function make(event: EventBriteEvent): Item {
        const source: Source = require('./source.json')
        const venue: EventBriteVenue = event.venue

        const item: Item = {
            eventId: makeId(event.id, source.id),
            sourceId: event.id,
            source: source.id,
            name: makeText(event.name.text),
            location: {
                type: "Point",
                coordinates:[parseFloat(venue.address.longitude), parseFloat(venue.address.latitude)]
            },
            venue: {
                id: venue.id,
                name: (!!venue.name ? makeText(venue.name) : ''),
                city: venue.address.city,
                region: venue.address.region,
                country: venue.address.country,
                address: (!!venue.address.address_1 ? venue.address.address_1 : ''),
                zipcode: venue.address.postal_code,
                location: {
                    type: "Point",
                    coordinates:[parseFloat(venue.address.longitude), parseFloat(venue.address.latitude)]
                }
            },
            url: event.url
        }

        // price
        if(!!event.ticket_classes && event.ticket_classes.length > 0 ) {
            const ticket: TicketClass = event.ticket_classes[0]
            if(!!ticket.cost){
                item.price = {
                    currency: event.currency,
                    min: parseFloat(ticket.cost!.major_value)
                }
            } else if(!!event.is_free) {
                item.price = {
                    currency: event.currency,
                    min: 0
                }
            }
        }

        // tags
        item.tags = []
        if(!!event.category) {
            item.tags.push(event.category.name.toLocaleLowerCase())
        }
        if(!!event.subcategory) {
            item.tags.push(event.subcategory.name.toLocaleLowerCase())
        }

        // promoter
        if(!!event.organizer) {
            item.promoter = {
                id: event.organizer.id,
                name: (!!event.organizer.name ? makeText(event.organizer.name) : '')
            }
        }

        // info
        item.info = ""
        if(!!event.description && !!event.description.text) {
            item.info += event.description.text
        }
        if(!!event.ticket_classes && !!event.ticket_classes[0] && !!event.ticket_classes[0].description) {
            item.info += " " + event.ticket_classes[0].description
        }
        item.info = makeText(item.info)

        // dates
        if(!!event.start && !!event.start.local) {
            const date = new Date(event.start.local)
            item.start = date
        }

        if(!!event.end && !!event.end.local) {
            const date = new Date(event.end.local)
            item.end = date
        }

        // images
        if(!!event.logo && !!event.logo.original) {
            event.logo.original.ratio = "auto"
            const images:Image[] = [event.logo.original]
            item.images = images
        }

        return item
    }

    /**
     *
     *
     * @export
     * @param {string} text
     * @returns {string}
     */
    export function makeText(text: string): string {
        const unicode_chars = new RegExp('[\u0009\u000B\u000C\u00A0\u1680\u180E' +
               '\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A' +
               '\u202F\u205F\u3000\uFEFF]', 'g');

        text = text.replace(/\n|\r/g, '')
        text = text.toString().replace(unicode_chars, '')
        return text.trim()
    }
}