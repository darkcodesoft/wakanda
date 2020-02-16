import { Document, Schema, Model } from 'mongoose';
import { connection } from '../../storage/connection';
import { Item } from '../../interfaces/Event';

// Configure and export EventModel Type
export interface EventModel extends Item, Document { }

// Configure Location sub-schema
const LocationSchema = new Schema({
  type: { type: String, enum: ['Point'], required: true },
  coordinates: { type: [Number], required: true }
}, { _id: false });

// Configure Promoter sub-schema
const PromoterSchema = new Schema({
  id: String,
  name: String
}, { _id: false });

// Configure Venue sub-schema
const VenueSchema = new Schema({
  id: String,
  name: { type: String, text: true },
  city: { type: String, text: true },
  region: { type: String, text: true },
  country: { type: String, text: true },
  address: { type: String, text: true },
  zipcode: { type: String, text: true },
  location: { type: LocationSchema, required: true }
}, { _id: false });

VenueSchema.index({ name: 'text', city: 'text', region: 'text', country: 'text', address: 'text', zipcode: 'text' });

// Configure Image sub-schema
const ImageSchema = new Schema({
  ratio: String,
  url: { type: String, required: true },
  width: Number,
  height: Number
}, { _id: false });

// Configure Price sub-schema
const PriceSchema = new Schema({
  currency: String,
  min: Number,
  max: Number
}, { _id: false });

// Configure Event schema
const EventSchema = new Schema({
  eventId: { type: String, unique: true },
  sourceId: String,
  source: String,
  name: { type: String, text: true, required: true },
  info: { type: String, text: true },
  images: [ImageSchema],
  location: { type: LocationSchema, required: true },
  venue: VenueSchema,
  start: { type: Date, required: true },
  end: Date,
  tags: { type: [String], text: true },
  promoter: PromoterSchema,
  url: String,
  active: { type: Boolean, default: true },
  price: PriceSchema
});

EventSchema.index({ name: 'text', info: 'text', tags: 'text', location: '2dsphere' });

// Export Event model
export const Event: Model<EventModel> = connection.model<EventModel>('Event', EventSchema);
