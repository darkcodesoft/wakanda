import { Document, Schema, Model, Mongoose, HookNextFunction } from "mongoose"
import { connection } from '../../storage/connection'
import roles from './roles.json'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

// Define User interface
export interface User {
    name: string
    email: string
    password: string
}

// Configure and export UserModel type
export interface UserModel extends User, Document {
    comparePassword(candidatePassword: string, cb: (error:any, isMatch?: boolean) => void): void
}

// Configure Role sub-Schema
const RoleSchema = new Schema({
    name: String,
    permissions: [String]
}, { _id: false})

// Configure User Schema
const UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: RoleSchema, default: roles.user },
    password: { type: String, required: true }
})

// bcrypt password on save
UserSchema.pre('save', function(next: HookNextFunction) {
    const user = this as UserModel
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)

            // override the cleartext password with the hashed one
            user.password = hash
            next()
        })
    })
})

// configure bcrypt passwords compare method
UserSchema.methods.comparePassword = function(candidatePassword: string, cb: (error:any, isMatch?: boolean) => void): void {
    const user = this as UserModel
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

// validators
// email
UserSchema.path('email').validate((email: string) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return emailRegex.test(email)
 }, 'Email is invalid.')

 // password
UserSchema.path('password').validate((password: string) => {
    return password.length >= 6
 }, 'Password is invalid.')

// Export User Model
export const User: Model<UserModel> = connection.model<UserModel>("User", UserSchema)