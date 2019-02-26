import Server from '../../public/server'
import express from 'express'
import createError from 'http-errors'

const greeter = require('../../build/Release/greet.node')

/**
 *
 *
 * @class App
 */
class App {

    /**
     *
     *
     * @private
     * @static
     * @type {(Server|null)}
     * @memberof App
     */
    private static instance?:App|null = null;

    /**
     *
     *
     * @static
     * @type {Server}
     * @memberof App
     */
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
        // HTTP errors handlers
        // 404
        this.server.router.use((req, res, next) => {
            next(createError(404))
        })

        // 500s
        this.server.router.use((err:any, req:express.Request, res:express.Response, next:any) => {
            // set locals, only providing error in development
            res.locals.message = err.message
            res.locals.error = req.app.get('env') === 'development' ? err : {}

            // render the error page
            res.status(err.status || 500)
            res.render('error')
        })
    }

    /**
     * Application init method
     *
     * @returns boolean
     * @memberof App
     */
    public main(): boolean {
        this.server.start()
        return true
    }
}

export default App