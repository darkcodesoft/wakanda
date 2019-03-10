import {
    Item,
    Source,
    Image,
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
        let event: TicketMasterEvent
        let i = 0
        const max = events.length

        for( ; i < max; i++ ) {
            event = events[i]
            if(!event.test) {
                collection[i] = makeFromTicketMasterEvent(event)
            }
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

        const item: Item = {
            eventId: makeEventId(event.id, source.id),
            sourceId: event.id,
            source: source.id,
            name: event.name.trim(),
            location: {
                type: "Point",
                coordinates:[parseFloat(venue.location.longitude), parseFloat(venue.location.latitude)]
            },
            venue: {
                id: venue.id,
                name: venue.name.trim(),
                city: venue.city.name,
                region: venue.state.name,
                country: venue.country.name,
                address: (!!venue.address.line1 ? venue.address.line1 : ''),
                zipcode: venue.postalCode,
                location: {
                    type: "Point",
                    coordinates:[parseFloat(venue.location.longitude), parseFloat(venue.location.latitude)]
                }
            },
            url: event.url
        }

        // tags
        if(!!event.classifications && event.classifications.length > 0) {
            const classifications = event.classifications[0]
            item.tags = []
            if(!!classifications.segment) {
                item.tags.push(classifications.segment.name.toLocaleLowerCase())
            }
            if(!!classifications.genre) {
                item.tags.push(classifications.genre.name.toLocaleLowerCase())
            }
            if(!!classifications.subGenre) {
                item.tags.push(classifications.subGenre.name.toLocaleLowerCase())
            }
        }

        // promoter
        if(!!event.promoter) {
            item.promoter = {
                id: event.promoter.id,
                name: event.promoter.name.trim()
            }
        }

        // info
        item.info = ""
        if(!!event.info) {
            item.info += event.info
        }
        if(!!event.pleaseNote) {
            item.info += " " + event.pleaseNote
        }
        item.info.trim()

        // // dates
        if(!!event.dates.start && !!event.dates.start.dateTime) {
            let date = new Date(event.dates.start.dateTime)
            item.start = date
        } else if(!!event.dates.start && !!event.dates.start.localDate) {
            let date = new Date(event.dates.start.localDate)
            item.start = date
        }

        // // if(!!event.dates.end) {
        if(!!event.dates.end && !!event.dates.end.dateTime) {
            let date = new Date(event.dates.end.dateTime)
            item.end = date
        } else if(!!event.dates.end && !!event.dates.end.localDate) {
            let date = new Date(event.dates.end.localDate)
            item.end = date
        }

        // images
        if(!!event.images) {
            let image: Image
            let i = 0
            const images = []
            const max = event.images.length

            for( ; i < max; i++ ) {
                image = event.images[i]
                if(image.ratio === "3_2") {
                    images.push(image)
                }
            }

            item.images = images
        }

        return item
    }
}