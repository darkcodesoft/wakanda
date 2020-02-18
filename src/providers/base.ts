import { Item } from '../interfaces/Event';
import { Event } from '../models/Event';
import { MineJob } from '../models/Job';
import { send } from '../services/notification';
import Socket from '../../public/socket';
import axios from 'axios';

/**
 *
 *
 * @export
 * @class BaseProvider
 */
export default class BaseProvider {
  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof BaseProvider
   */
  protected api?: string = undefined

  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof BaseProvider
   */
  protected id?: string = undefined

  /**
   *
   *
   * @protected
   * @type {URL}
   * @memberof BaseProvider
   */
  protected url?: URL = undefined

  /**
   * Base start page
   *
   * @protected
   * @type {number}
   * @memberof BaseProvider
   */
  protected page: number = 1

  /**
   *
   *
   * @protected
   * @type {number}
   * @memberof BaseProvider
   */
  protected limit?: number = undefined

  /**
   *
   *
   * @protected
   * @type {Item[]}
   * @memberof BaseProvider
   */
  protected succeeded: Item[] = []

  /**
   *
   *
   * @protected
   * @type {URL[]}
   * @memberof BaseProvider
   */
  protected failed: URL[] = []

  /**
   *
   *
   * @protected
   * @type {*}
   * @memberof BaseProvider
   */
  protected Factory?: any = undefined

  /**
   *
   *
   * @returns {number}
   * @memberof TicketMaster
   */
  protected getPage (): number {
    return this.page;
  }

  /**
   *
   *
   * @param {number} p
   * @memberof TicketMaster
   */
  protected setPage (p: number): void {
    this.page = p;
      this.url!.searchParams.set('page', p.toString());
  }

  /**
   *
   *
   * @memberof TicketMaster
   */
  protected nextPage (): void {
    this.page++;
    this.setPage(this.page);
  }

  /**
   *
   *
   * @memberof TicketMaster
   */
  protected previousPage (): void {
    this.page--;
    this.setPage(this.page);
  }

  /**
   *
   *
   * @returns {URL[]}
   * @memberof TicketMaster
   */
  protected getFailed (): URL[] {
    return this.failed;
  }

  /**
   *
   *
   * @returns {TicketMasterEvent[]}
   * @memberof TicketMaster
   */
  protected getSucceeded (): Item[] {
    return this.succeeded;
  }

  /**
   *
   *
   * @protected
   * @memberof BaseProvider
   */
  protected configureUrl () {
    this.url = new URL(this.api!);
  }

  /**
   *
   *
   * @private
   * @param {URL} url
   * @param {any} response
   * @memberof TicketMaster
   */
  protected successHandler (url: URL, response: any): void {
    console.log('[+] SUCCESS: ' + url.href);
    Socket.static().send(JSON.stringify({ message: 'FETCH_SUCCESS', url: url, response: response }));
  }

  /**
   * Api error reponse handler
   *
   * @private
   * @param {URL} url
   * @param {Error} error
   * @memberof TicketMaster
   */
  protected errorHandler (url: URL, error: Error): void {
    this.failed.push(url);
    console.error('[-] ERROR: ' + url.href);
    console.error(error);
    Socket.static().json({ message: 'FETCH_ERROR', data: error });
  }

  /**
   *
   *
   * @memberof TicketMaster
   */
  public async fetch (): Promise<void> {
    send(this.id! + ' mining started.');

    let n = 1;
    this.configureUrl();
    this.setPage(n);

    do {
      const result = await axios.get(this.url!.href);
      const json = result.data;

      if (!!json.fault || !!json.error) {
        this.errorHandler(this.url!, json);
        this.store();
        break;
      } else {
        this.successHandler(this.url!, json);
      }

      n++;
      this.setPage(n);

      if (n === this.limit) {
        this.store();
        break;
      }
    } while (n <= this.limit!);
  }

  /**
   *
   *
   * @protected
   * @returns {(Promise<boolean|any>)}
   * @memberof BaseProvider
   */
  protected async store (): Promise<boolean|any> {
    const now = new Date().toISOString();

    try {
      const reset = await Event.deleteMany({ source: this.id });

      if (reset.ok === 1) {
        const result = await Event.insertMany(this.succeeded, { ordered: false });
        this.succeeded = [];
        await MineJob.deleteMany({ mineId: this.id });
        await new MineJob({ mineId: this.id, count: result.length, timestamp: now }).save();
        const totalEntries = await Event.estimatedDocumentCount();
        console.log(`[+] ${this.id} fetch success: ${totalEntries}`);
        Socket.static().send(JSON.stringify({ message: 'PROVIDER_SUCCESS', provider: this.id, count: result.length }));
        send(this.id + ' mining success total entries: ' + totalEntries);
      }
    } catch (e) {
      send(this.id + ' mining error at : ' + now);
      console.log(e);
      Socket.static().json({ message: 'PROVIDER_ERROR', data: e });
    }
  }
}
