import express from 'express'
import spdy from 'spdy'
import fs from 'fs'
import cors from 'cors'
import { domains } from './cors.json'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import crypto from 'crypto'
import { name } from '../package.json'
import { connection } from '../src/storage/connection'

/**
 *
 * Defines Server
 * @class Server
 */
export default class Server {

    private static instance?:Server|null = null
    private port: number = 3000
    private ports: number[] = []
    private cookieSecret: string

    public readonly process: express.Application
    public readonly router: express.Router

    /**
     * Get server static instance
     *
     * @static
     * @returns
     * @memberof Server
     */
    public static static(): Server {
        if(Server.instance === null) {
            Server.instance = new Server
        }
        return Server.instance!;
    }

    /**
     * Creates an instance of Server.
     *
     * @memberof Server
     * @param String name
     * @return Server instance
     */
    constructor() {
        this.process = express()
        this.cookieSecret = crypto.createHash('md5').update(name).digest("hex")
        this.setupMiddleWares()
        this.router = express.Router()
        this.process.use(this.router)

        let port:number;
        if(!!process.env.PORT) {
            port = parseInt(process.env.PORT)
            this.setPort(port)
        }
    }

    /**
     * Set up default middlewares
     * @returns void
     */
    private setupMiddleWares(): void {
        this.process.use(this.corsSetup())
        // add http logger
        this.process.use(logger('dev'))
        // add json
        this.process.use(express.json())
        // add urlencoder
        this.process.use(express.urlencoded({ extended: false }))
        // add coockie parser
        this.process.use(cookieParser(this.cookieSecret))
        // setup public directory
        this.process.use(express.static(path.join(__dirname, 'public')))
        // setup views directory
        this.process.set('views', path.join(__dirname, 'views'))
        // setup view engine
        this.process.set('view engine', 'pug')
    }

    /**
     * Set Port
     *
     * @param number port
     * @return void
     */
    public setPort(port:number): void {
        if(this.portIsValid(port)) {
            this.port = port
            this.ports.push(port)
        } else {
            throw TypeError(`${port} is not a valid port.`)
        }
    }

    /**
     * Get active port
     *
     * @return number port
     */
    public getPort(): number {
        return this.port
    }

    /**
     * Get active ports
     *
     * @returns {number[]}
     * @memberof Server
     */
    public getPorts(): number[] {
        return this.ports
    }

    /**
     * Check if port is valid
     *
     * @private
     * @param {number} port
     * @returns {boolean}
     * @memberof Server
     */
    private portIsValid( port:number ): boolean {
        const min = 1
        const max = 65535
        var num = +port;
        return num >= min && num <= max && port === num;
    }

    /**
     * CORS setup
     * @returns Function
     */
    private corsSetup() {
        return cors((req, callback) => {
            let config
            if(domains.indexOf(req.header('Origin')!) !== -1) {
                config = { origin: true }
            } else {
                config = { origin: false }
            }
            callback( null, config )
        })
    }

    /**
     * Start server
     *
     * @memberof Server
     */
    public start(): void {
        const port:number = this.getPort()
        this.process.listen(port, () => {
            console.log(`Server started @ port: ${port}`)
        })
        // const port: number = this.getPort()
        // const options: spdy.ServerOptions = {
        //     key: fs.readFileSync(path.join(__dirname, 'certificate/server.key'), 'utf8'),
        //     cert: fs.readFileSync(path.join(__dirname, 'certificate/server.crt'), 'utf8')
        // }

        // spdy.createServer(options, this.process).listen(port, (err: any) => {
        //     if (err) throw new Error(err)
        //     console.log(`Server started @ port: ${port}`)
        // });
    }
}