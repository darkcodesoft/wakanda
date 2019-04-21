import Server from '../../public/server'
import express from 'express'
import createError, { HttpError } from 'http-errors'
import { jsonHttpError } from '../lib/http'
import routes from '../../public/routes/'

/**
 *
 *
 * @class App
 */
export default class App {

    private static instance?:App|null = null;
    public server:Server

    /**
     *
     *
     * @static
     * @returns {App}
     * @memberof App
     */
    public static static(): App {
        if(App.instance === null) {
            App.instance = new App
        }
        return App.instance!;
    }

    /**
     *Creates an instance of App.
     * @memberof App
     */
    constructor() {
        this.server = Server.static()
        this.setupDefaultApplicationRoutes()
    }

    /**
     * Setup default application routes
     *
     * @private
     * @memberof App
     */
    private setupDefaultApplicationRoutes(): void {
        // Mount app routes
        this.server.router.use('/api/v1/', routes)

        // HTTP errors handlers
        // 404
        this.server.router.use((req:express.Request, res: express.Response, next:express.NextFunction) => {
            next(createError(404))
        })

        // 500s
        this.server.router.use((err:HttpError, req:express.Request, res:express.Response, next:express.NextFunction) => {
            res.locals.message = err.message
            res.locals.error = req.app.get('env') === 'development' ? err : {}
            jsonHttpError(res, { code: (err.status || 500), data: err })
        })
    }

    /**
     * Application init method
     *
     * @returns boolean
     * @memberof App
     */
    public main(): boolean {
        try {
            this.server.start()
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}