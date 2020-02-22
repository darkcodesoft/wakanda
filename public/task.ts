import { CronJob } from 'cron';
// import { spawn } from 'child_process';
// import { join } from 'path';
import os from 'os';
import TicketMaster from '../src/providers/TicketMaster';

/**
 * Task controller
 * @class Task
 */
export default class Task {
  /**
   * static isntance item
   */
  private static instance?:Task|null = null

  /**
   *
   *
   * @static
   * @returns {App}
   * @memberof App
   */
  public static static (): Task {
    if (Task.instance === null) {
      Task.instance = new Task();
    }
    return Task.instance!;
  }

  /**
   * Application init method
   *
   * @returns boolean
   * @memberof App
   */
  public start (): boolean {
    try {
      /**
       *
       * Configure cron job to mine for events at minute 0 past every 12th hour.
       */
      if (process.env && process.env.pm_id) {
        if (parseInt(process.env.pm_id) % os.cpus().length !== 0) {
          console.log('[-] in workder cluster.');
        } else {
          const job = new CronJob('*/2 * * * *', () => { // every 2 minutes
          // const job = new CronJob('0 */12 * * *', () => { // every 12 hours
            TicketMaster.fetch();
            //  spawn(join(process.cwd(), 'node_modules/ts-node/dist/bin.js'), [join(process.cwd(), 'src/providers/index.ts')]);
            const now = new Date().toISOString();
            console.log('[+] automatic mining job started at ' + now);
          }, undefined, true, 'America/New_York');

          // run stat job script
          job.start();
        }
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
