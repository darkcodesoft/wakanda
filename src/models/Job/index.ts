import { Document, Schema, Model } from 'mongoose';
import { connection } from '../../storage/connection';

export interface MineJobModel extends Document { }

// Configure MineJob schema
const MineJobSchema = new Schema({
  mineId: { type: String, unique: true },
  count: Number,
  timestamp: { type: Date, required: true }
});

// Export MineJob model
export const MineJob: Model<MineJobModel> = connection.model<MineJobModel>('MineJob', MineJobSchema);
