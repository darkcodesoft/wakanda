import {
    Item,
    Source,
    TicketMasterEvent,
    TicketMasterVenue
} from '../interfaces/Event'

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
    export function makeEventId(sourceItemId: string, source: string): string {
        return `${source}__${sourceItemId}`
    }

    /**
     * Parse TicketMasterEvent array into Event Item array
     *
     * @export
     * @param {TicketMasterEvent[]} events
     * @returns {Item[]}
     */
    export function makeFromTicketMasterEvents(events: TicketMasterEvent[]): Item[] {
        const collection: Item[] = []
        let i = 0
        const max = events.length

        for( ; i < max; i++ ) {
            collection[i] = makeFromTicketMasterEvent(events[i])
        }

        return collection
    }

    /**
     * Parse TicketMasterEvent into Event Item model type
     *
     * @export
     * @param {TicketMasterEvent} event
     * @returns {Item}
     */
    export function makeFromTicketMasterEvent(event: TicketMasterEvent): Item {
        const source: Source = require('../providers/TicketMaster/source.json')
        const venue: TicketMasterVenue = event._embedded.venues[0]
        const classifications = event.classifications[0]
        const item: Item = {
            eventId: makeEventId(event.id, source.id),
            sourceId: event.id,
            source: source.id,
            name: event.name,
            info: event.info! + event.pleaseNote!,
            location: {
                type: "Point",
                coordinates:[parseFloat(venue.location.longitude), parseFloat(venue.location.latitude)]
            },
            promoter: {
                id: event.promoter ? event.promoter.id : '',
                name: event.promoter ? event.promoter.name : ''
            },
            venue: {
                id: venue.id,
                name: venue.name,
                city: venue.city.name,
                region: venue.state.name,
                country: venue.country.name,
                address: venue.address.line1,
                zipcode: venue.postalCode,
                location: {
                    type: "Point",
                    coordinates:[parseFloat(venue.location.longitude), parseFloat(venue.location.latitude)]
                }
            },
            tags: [
                classifications.segment.name.toLocaleLowerCase(),
                classifications.genre.name.toLocaleLowerCase(),
                classifications.subGenre.name.toLocaleLowerCase(),
            ]
        }

        return item
    }
}