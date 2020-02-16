import BaseProvider from '../base';
import { collect } from './factory';
import { Item, TicketMasterEvent } from '../../interfaces/Event';

/**
 *
 *
 * @class TicketMaster
 * @extends {BaseProvider}
 */
class TicketMaster extends BaseProvider {
  /**
   *
   *
   * @protected
   * @memberof TicketMaster
   */
  protected id = 'ticketmaster'

  /**
   *
   *
   * @protected
   * @memberof TicketMaster
   */
  protected api = 'https://app.ticketmaster.com/discovery/v2/events.json'

  /**
   *
   *
   * @private
   * @memberof TicketMaster
   */
  private apikey = 'M17CmH9jOiYwSGsDCMSVV0GNgmLmffYc'

  /**
   *
   *
   * @private
   * @memberof TicketMaster
   */
  private countryCode = 'US'

  /**
   *
   *
   * @private
   * @memberof TicketMaster
   */
  private marketId = 35

  /**
   *
   *
   * @protected
   * @memberof TicketMaster
   */
  protected limit = 50 // 50

  /**
   *
   *
   * @private
   * @memberof TicketMaster
   */
  private classificationName = [
    'music',
    'movies',
    'film',
    'dance',
    'sports'
  ]

  /**
   *
   *
   * @protected
   * @memberof TicketMaster
   */
  protected configureUrl (): void {
    super.configureUrl();
      this.url!.searchParams.set('apikey', this.apikey);
      this.url!.searchParams.set('countryCode', this.countryCode);
      this.url!.searchParams.set('marketId', this.marketId.toString());
      this.url!.searchParams.set('startDateTime', new Date().toISOString().split('.')[0] + 'Z');
      this.url!.searchParams.set('sort', 'date,asc');
      this.url!.searchParams.set('classificationName', this.classificationName.join(',')); // should be set by user preference
  }

  /**
   *
   *
   * @protected
   * @param {URL} url
   * @param {*} response
   * @memberof TicketMaster
   */
  protected successHandler (url: URL, response: any): void {
    const events: TicketMasterEvent[] = response._embedded.events;
    const collection: Item[] = collect(events);
    this.succeeded.push(...collection);
    super.successHandler(url, response);
  }
}

export default new TicketMaster();
