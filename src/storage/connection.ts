import mongoose from "mongoose"
import { host, port, db } from './storage.json'

const connectionURI = `${host}:${port}/${db}`

/**
 * Configure and export database connection
 */
export const connection = mongoose.createConnection(connectionURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
})

/**
 * Connection error handler
 * If first connect fails because mongod is down, try again later.
 */
connection.on('error', (err) => {
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        console.log(new Date(), String(err));

        setTimeout( () => {
            console.log("Retrying first connect...");
            connection.openUri(connectionURI).catch(() => {})
            // Why the empty catch?
            // Well, errors thrown by db.open() will also be passed to .on('error'),
            // so we can handle them there, no need to log anything in the catch here.
            // But we still need this empty catch to avoid unhandled rejections.
        }, 20 * 1000);
    } else {
        // Some other error occurred.  Log it.
        console.error(new Date(), String(err))
    }
});

/**
 * Open connection once
 */
connection.once('open', () => {
    console.log("Connection to db established.")
});