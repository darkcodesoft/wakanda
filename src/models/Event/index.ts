import mongoose, { Document, Schema, Model } from "mongoose"
import { Item } from '../../interfaces/Event'
import { host, port, db } from './storage.json'

/**
 * Configure and export database connection
 */
export const connection = mongoose.createConnection(`${host}:${port}/${db}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
})

/**
 * Configure and export EventModel Type
 */
export interface EventModel extends Item, Document { }

/**
 * Configure Location sub-schema
 */
const LocationSchema = new Schema({
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }
}, { _id : false })

/**
 * Configure Promoter sub-schema
 */
const PromoterSchema = new Schema({
    id: String,
    name: String
}, { _id : false })

/**
 * Configure Venue sub-schema
 */
const VenueSchema = new Schema({
    id: String,
    name: String,
    city: String,
    region: String,
    country: String,
    address: String,
    zipcode: String,
    location: LocationSchema
}, { _id : false })

/**
 * Configure Event schema
 */
const EventSchema = new Schema({
    eventId : { type: String, index: true },
    sourceId: String,
    source: String,
    name: { type: String, index: true, required: true },
    info: { type: String, index: true },
    location: { type: LocationSchema, required: true },
    promoter: PromoterSchema,
    start: { type: Date, required: true},
    end: Date,
    venue: VenueSchema,
    tags: { type:[String], index: true },
    active: { type: Boolean, default: true }
})

/**
 * Export Event model
 */
export const Event: Model<EventModel> = connection.model<EventModel>("Event", EventSchema)

/** */
