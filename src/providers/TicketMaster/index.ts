import { Item, Source, TicketMasterSuccessResponse, TicketMasterEvent } from '../../interfaces/Event'
import { NativeRequest } from '../../addons/request';
import { connection } from '../../storage/connection'
import { Event } from '../../models/Event'
import { id, domain, apikey, countryCode, limit, marketId } from './source.json'
import { Factory } from './factory'

/**
 * Define TicketMaster Provider.
 *
 * @export
 * @class TicketMaster
 * @implements {Source}
 * @implements {Storage}
 */
export default class TicketMaster implements Source {

    public id: string
    public domain: string
    public limit: number
    public apikey: string
    public countryCode: string
    public marketId: number

    private url: URL
    private succeeded: Item[] = []
    private failed: URL[] = []

    private client: NativeRequest.Client = NativeRequest.Client
    private page: number = 0

    private static instance?: TicketMaster|null = null;

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
    public setPage(p: number): void {
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
     *
     * @memberof TicketMaster
     */
    public previousPage(): void {
        this.page--
        this.setPage(this.page)
    }

    /**
     *
     *
     * @returns {URL[]}
     * @memberof TicketMaster
     */
    public getFailed(): URL[] {
        return this.failed
    }

    /**
     *
     *
     * @returns {TicketMasterEvent[]}
     * @memberof TicketMaster
     */
    public getSucceeded(): Item[] {
        return this.succeeded
    }


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
     * Creates an instance of TicketMaster
     *
     * @memberof TicketMaster
     */
    constructor() {
        // configure source
        this.id = id
        this.domain = domain
        this.apikey = apikey
        this.countryCode = countryCode!
        this.limit = limit
        this.marketId = marketId

        // configure url
        this.url = new URL(domain)
        this.url.searchParams.set('apikey', apikey)
        this.url.searchParams.set('countryCode', countryCode!)
        this.url.searchParams.set('marketId', marketId!.toString())
    }

    /**
     *
     *
     * @private
     * @param {URL} url
     * @param {TicketMasterSuccessResponse} response
     * @memberof TicketMaster
     */
    private successHandler(url: URL, response: TicketMasterSuccessResponse): void {
        const events: TicketMasterEvent[] = response._embedded.events
        const collection: Item[] = Factory.collect(events)
        this.succeeded.push(...collection)
    }

    /**
     * Api error reponse handler
     *
     * @private
     * @param {URL} url
     * @param {Error} error
     * @memberof TicketMaster
     */
    private errorHandler(url: URL, error: Error): void {
        this.failed.push(url)
        console.error('ERROR: ' + url.href)
        console.error(error)
    }

    /**
     *
     *
     * @memberof TicketMaster
     */
    public fetch(): void {
        let n = 0
        this.setPage(n)

        do {
            const result = this.client.request(this.url.href)
            const json = JSON.parse(result)

            if(!!json.fault || !!json.error) {
                this.errorHandler(this.url, json)
                this.store()
                break
            } else {
                this.successHandler(this.url, json as TicketMasterSuccessResponse)
            }

            n++
            this.setPage(n)

            if(n === this.limit) {
                this.store()
                break
            }
        } while(n <= this.limit)
    }

    /**
     * Store provider data
     *
     * @memberof TicketMaster
     */
    public store(): void {
        Event.deleteMany({ source: this.id }, (err) => {
            if(!err) {
                Event.insertMany(this.succeeded, { ordered: false }, (err, docs) => {
                    console.log(`!!! ${this.id} events insert success`)
                    connection.close()
                })
            } else {
                console.log(err)
            }
        })
    }
}