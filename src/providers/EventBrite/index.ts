import { Item, Source, EventBriteSuccessResponse, EventBriteEvent } from '../../interfaces/Event'
import { NativeRequest } from '../../addons/request';
import { connection } from '../../storage/connection'
import { Event } from '../../models/Event'
import { id, domain, token, expand, location, limit } from './source.json'
import { Factory } from './factory'

/**
 * Define EventBrite Provider.
 *
 * @export
 * @class EventBrite
 * @implements {Source}
 * @implements {Storage}
 */
export default class EventBrite implements Source {

    public id: string
    public domain: string
    public token: string
    public limit: number
    public location: string

    private url: URL
    private succeeded: Item[] = []
    private failed: URL[] = []

    private client: NativeRequest.Client = NativeRequest.Client
    private page: number = 0

    private static instance?: EventBrite|null = null;

    /**
     *
     *
     * @returns {number}
     * @memberof EventBrite
     */
    public getPage(): number {
        return this.page
    }

    /**
     *
     *
     * @param {number} p
     * @memberof EventBrite
     */
    public setPage(p: number): void {
        this.page = p
        this.url.searchParams.set('page', p.toString())
    }

    /**
     *
     *
     * @memberof EventBrite
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
     * @returns {URL[]}
     * @memberof EventBrite
     */
    public getFailed(): URL[] {
        return this.failed
    }

    /**
     *
     *
     * @returns {Item[]}
     * @memberof EventBrite
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
    public static static(): EventBrite {
        if(EventBrite.instance === null) {
            EventBrite.instance = new EventBrite
        }
        return EventBrite.instance!;
    }

    /**
     * Creates an instance of EventBrite
     *
     * @memberof EventBrite
     */
    constructor() {
        // configure source
        this.id = id
        this.domain = domain
        this.token = token
        this.location = location
        this.limit = limit

        // configure url
        this.url = new URL(domain)
        this.url.searchParams.set('token', token)
        this.url.searchParams.set('expand', expand)
        this.url.searchParams.set('location.address', location)
        this.url.searchParams.set('location.within', '300km')
        this.url.searchParams.set('sort_by', 'date')
    }

    /**
     *
     *
     * @private
     * @param {URL} url
     * @param {EventBriteSuccessResponse} response
     * @memberof EventBrite
     */
    private successHandler(url: URL, response: EventBriteSuccessResponse): void {
        const events: EventBriteEvent[] = response.events
        const collection: Item[] = Factory.collect(events)
        this.succeeded.push(...collection)
    }

    /**
     *
     *
     * @private
     * @param {URL} url
     * @param {Error} error
     * @memberof EventBrite
     */
    private errorHandler(url: URL, error: Error): void {
        this.failed.push(url)
        console.error('ERROR: ' + url.href)
        console.error(error)
    }

    /**
     *
     *
     * @memberof EventBrite
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
                this.successHandler(this.url, json as EventBriteSuccessResponse)
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
     * @memberof EventBrite
     */
    public store(): void {
        // console.log(this.succeeded)
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