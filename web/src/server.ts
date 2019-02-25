import express from 'express'

/**
 *
 * Defines Server
 * @class Server
 */
class Server {

    /**
     *
     * @private
     * @static
     * @type {(Server|null)}
     * @memberof Server
     */
    private static instance?:Server|null = null;

    /**
     *
     * @private
     * @type {(string|number)}
     * @memberof Server
     */
    private port: number = 3000

    /**
     *
     * @private
     * @type {number[]}
     * @memberof Server
     */
    private ports: number[] = [];

    /**
     *
     * @private
     * @type {express.Application}
     * @memberof Server
     */
    public readonly process: express.Application

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

        let port:number;
        if(!!process.env.PORT) {
            port = parseInt(process.env.PORT)
            this.setPort(port)
        }
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
     * Add route
     *
     * @param {string} path
     * @param {Function} callback
     * @memberof Server
     */
    public route(path:string, callback:Function): void {
        this.process.get(path, (req: express.Request, res: express.Response) => {
            const data = callback()
            res.send(data)
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
    }
}

export default Server