import { Item, Source, TicketMasterSuccessResponse, TicketMasterEvent } from '../../interfaces/Event'
import { NativeRequest } from '../../addons/request';
import { Event, connection } from '../../models/Event'
import { Factory } from '../../models/Factory'
import { id, domain, apikey, countryCode, limit } from './source.json'
import { connect } from 'mongoose';

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
    public setPage(p: number): void{
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

        // configure url
        this.url = new URL(domain)
        this.url.searchParams.set('apikey', apikey)
        this.url.searchParams.set('countryCode', countryCode!)
    }

    /**
     * Api success response handler
     *
     * @todo add test
     * @private
     * @param {URL} url
     * @param {{_embedded:{events:Object[]}}} json
     * @memberof TicketMaster
     */
    private successHandler(response: TicketMasterSuccessResponse): void {
        const events: TicketMasterEvent[] = response._embedded.events
        const collection: Item[] = Factory.makeFromTicketMasterEvents(events)
        this.succeeded.push(...collection)
    }

    /**
     * Api error reponse handler
     *
     * @todo add test
     * @private
     * @param {URL} url
     * @param {Error} error
     * @memberof TicketMaster
     */
    private errorHandler(url: URL, error: Error): void {
        this.failed.push(url)
        console.error(error)
        console.error(url)
    }

    /**
     * Fetch provider data
     *
     * @todo add test
     * @returns {string}
     * @memberof TicketMaster
     */
    public fetch(): void {
        let n = 0;
        this.setPage(n)

        do {
            const result = this.client.request(this.url.href)
            const json = JSON.parse(result)

            if(!!json.fault) {
                this.errorHandler(this.url, json)
            } else {
                this.successHandler(json as TicketMasterSuccessResponse)
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
                    connection.close()
                })
            } else {
                console.log(err)
            }
        })
    }
}