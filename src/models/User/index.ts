import { Document, Schema, Model } from "mongoose"
import { connection } from '../../storage/connection'
import { bcrypt } from 'bcrypt'


export interface EventModel extends Document { }

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})