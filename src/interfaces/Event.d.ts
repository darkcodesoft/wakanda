/**
 *
 *
 * @export
 * @interface Item
 */
export declare interface Item {
    eventId?: string
    sourceId?: string
    source?: string
    name?: string
    info?: string
    location?: Location
    promoter?: Promoter
    start?: Date
    end?: Date
    venue?: Venue
    tags?: string[]
    active?: boolean
    images?: Image[]
    url: string,
    price?: Price
}

/**
 *
 *
 * @export
 * @interface Organizer
 */
export declare interface Promoter {
    id: string
    name: string
}

/**
 *
 *
 * @export
 * @interface DateTime
 */
export declare interface DateTime {
    date: string,
    timeZone: string
}

/**
 *
 *
 * @export
 * @interface Category
 */
export declare interface Category {
    id: string
    name: string
}

/**
 *
 *
 * @export
 * @interface Venue
 */
export declare interface Venue {
    id: string
    name: string
    city: string
    region: string
    country: string
    address: string
    zipcode: string
    location: Location
}

export declare interface Location {
    type: string
    coordinates: [number, number]
}

/**
 *
 *
 * @export
 * @interface Config
 */
export declare interface Source {
    id: string
    domain: string
    apikey?: string
    token?: string
    countryCode?: string
    marketId?: number
    expand?: string
    location?: string
    limit: number
}

/**
 *
 *
 * @export
 * @interface Storage
 */
export declare interface Storage {
    host: string
    port: number
    db: string
    collection: string
}

/**
 *
 *
 * @export
 * @interface Image
 */
export declare interface Image {
    ratio?: string
    url: string
    width: number
    height: number
}

/**
 *
 *
 * @export
 * @interface TicketMasterResponse
 */
export declare interface TicketMasterSuccessResponse {
    _embedded : {
        events: TicketMasterEvent[]
    }
    _links: {
        self: TicketMasterLink
        first: TicketMasterLink
        last: TicketMasterLink
        prev: TicketMasterLink
        next: TicketMasterLink
    }
    page: TicketMasterPage
}

/**
 *
 *
 * @export
 * @interface TicketMasterEvent
 */
export declare interface TicketMasterEvent {
    id: string
    name: string
    promoter: Promoter
    info?: string
    pleaseNote?: string
    images?: Image[]
    dates: TicketMasterDateTime
    url: string
    test: boolean
    _embedded: { venues: TicketMasterVenue[] }
    classifications: {
        segment: { name: string }
        genre: { name: string }
        subGenre: { name: string }
    }[],
    priceRanges: Price[]
}

/**
 *
 *
 * @export
 * @interface Price
 */
export declare interface Price {
    currency: string
    min: number
    max?: number
}

/**
 *
 *
 * @export
 * @interface TicketMasterDate
 */
export declare interface TicketMasterDateTime {
    start: TicketMasterDate
    end?: TicketMasterDate
    timezone: string
}

/**
 *
 *
 * @export
 * @interface TicketMasterDate
 */
export declare interface TicketMasterDate {
    localDate: string
    localTime?: string
    dateTime?: string
}

/**
 *
 *
 * @export
 * @interface TicketMasterVenue
 */
export declare interface TicketMasterVenue {
    id: string
    name: string
    postalCode: string
    timezone: string
    city: { name: string }
    state: { name: string, stateCode: string }
    country: { name: string, countryCode: string }
    address: { line1: string }
    location: { longitude: string, latitude: string }
}

/**
 *
 *
 * @export
 * @interface Page
 */
export declare interface TicketMasterPage {
    size: number
    totalElements: number
    totalPages: number
    number: number
}

/**
 *
 *
 * @export
 * @interface Link
 */
export declare interface TicketMasterLink {
    href: string
}

/**
 *
 *
 * @export
 * @interface EventBriteSuccessResponse
 */
export declare interface EventBriteSuccessResponse {
    events : EventBriteEvent[]
    pagination: EventBritePage
}

/**
 *
 *
 * @export
 * @interface EventBriteEvent
 */
export declare interface EventBriteEvent {
    id: string
    name: { text: string }
    organizer: Promoter
    description: { text: string }
    logo?: { original: Image }
    start: { local: string }
    end: { local: string }
    url: string
    venue: EventBriteVenue
    category: { name: string },
    subcategory?: { name: string }
    is_locked: boolean
    status: boolean
    online_event: boolean
    is_free: boolean
    currency: string
    ticket_classes: TicketClass[]
    format_id: string
}

/**
 *
 *
 * @export
 * @interface EventBriteVenue
 */
export declare interface EventBriteVenue {
    id: string
    name?: string
    address: EventBriteAddress
}

/**
 *
 *
 * @export
 * @interface EventBriteAddress
 */
export declare interface EventBriteAddress {
    address_1: string
    city: string
    region: string
    postal_code: string
    country: string
    latitude: string
    longitude: string
}

/**
 *
 *
 * @export
 * @interface TicketClass
 */
export declare interface TicketClass {
    cost?: TicketCost
    description: string
}

/**
 *
 *
 * @export
 * @interface TicketCost
 */
export declare interface TicketCost {
    currency: string
    major_value: string
}

/**
 *
 *
 * @export
 * @interface EventBritePage
 */
export declare interface EventBritePage {
    object_count: number
    page_number: number
    page_size: number
    page_count: number
    has_more_items: boolean
}
