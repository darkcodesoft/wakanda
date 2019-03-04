const request = require('../../../build/Release/request.node')

/**
 *
 *
 * @class TicketMaster
 */
class TicketMaster {

    /**
     *
     *
     * @private
     * @static
     * @type {number}
     * @memberof TicketMaster
     */
    private static limit:number

    /**
     *
     *
     * @private
     * @static
     * @type {string}
     * @memberof TicketMaster
     */
    private static countryCode:string

    /**
     *
     *
     * @private
     * @type {URL}
     * @memberof TicketMaster
     */
    private url:URL

    /**
     *
     *
     * @private
     * @type {string}
     * @memberof TicketMaster
     */
    private domain: string

    /**
     *
     *
     * @private
     * @type {string}
     * @memberof TicketMaster
     */
    private apiKey: string

    /**
     *
     *
     * @private
     * @type {number}
     * @memberof TicketMaster
     */
    private page: number = 0

    /**
     *
     *
     * @private
     * @type {string[]}
     * @memberof TicketMaster
     */
    private failed: URL[] = []

    /**
     *
     *
     * @returns {string}
     * @memberof TicketMaster
     */
    public getDomain(): string {
        return this.domain
    }

    /**
     *
     *
     * @returns {string}
     * @memberof TicketMaster
     */
    public getApiKey(): string {
        return this.apiKey
    }

    /**
     *
     *
     * @returns {number}
     * @memberof TicketMaster
     */
    public getPage(): number {
        return this.page
    }

    /**
     *
     *
     * @param {number} p
     * @memberof TicketMaster
     */
    public setPage(p:number): void{
        this.page = p
        this.url.searchParams.set('page', p.toString())
    }

    /**
     *
     *
     * @memberof TicketMaster
     */
    public nextPage(): void {
        this.page++
        this.setPage(this.page)
    }

    /**
     *
     */
    public previousPage(): void {
        this.page--
        this.setPage(this.page)
    }

    /**
     *
     *
     * @returns {string[]}
     * @memberof TicketMaster
     */
    public getFailed(): URL[] {
        return this.failed
    }

    /**
     *
     *
     * @private
     * @static
     * @type {(Server|null)}
     * @memberof TicketMaster
     */
    private static instance?:TicketMaster|null = null;

    /**
     *
     *
     * @static
     * @returns {App}
     * @memberof App
     */
    public static static(): TicketMaster {
        if(TicketMaster.instance === null) {
            TicketMaster.instance = new TicketMaster
        }
        return TicketMaster.instance!;
    }

    /**
     *Creates an instance of App.
     * @memberof App
     */
    constructor() {
        // set config
        let config = require('./config.json')
        this.domain = config.domain!
        this.apiKey = config.apikey!
        TicketMaster.limit = config.apilimit!
        TicketMaster.countryCode = config.countryCode!

        // configure url
        this.url = new URL(this.domain)
        this.url.searchParams.set('apikey', this.apiKey)
        this.url.searchParams.set('countryCode', TicketMaster.countryCode)
    }

    /**
     *
     * @todo add test
     * @private
     * @param {URL} url
     * @param {{_embedded:{events:Object[]}}} json
     * @memberof TicketMaster
     */
    private successHandler(url:URL, json:{_embedded:{events:Object[]}}): void {
        console.log(json._embedded.events.length)
        console.log(url)
        // this.nextPage()
    }

    /**
     *
     * @todo add test
     * @private
     * @param {URL} url
     * @param {Error} error
     * @memberof TicketMaster
     */
    private errorHandler(url:URL, error:Error): void {
        this.failed.push(url)
        console.error(error)
        console.error(url)
    }

    /**
     *
     * @todo add test
     * @returns {string}
     * @memberof TicketMaster
     */
    public fetch(): void {
        var n = 0;
        this.setPage(n)
        do {
            const client = new request.Client()
            const result = client.request(this.url.href)
            let json = JSON.parse(result)
            if(!!json.fault) {
                this.errorHandler(this.url, json)
            } else {
                this.successHandler(this.url, json)
            }
            n++
            this.setPage(n)
        } while(n <= TicketMaster.limit)

    }
}

export default TicketMaster