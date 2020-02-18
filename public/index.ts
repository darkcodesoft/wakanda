import App from '../src/bootstrap/app';
import { CronJob } from 'cron';
// import { spawn } from 'child_process';
// import { join } from 'path';
import os from 'os';
import TicketMaster from '../src/providers/TicketMaster';

/**
 *
 * Get app singleton and process passed arguments to retrieve
 * port number if given.
 */
const app = App.static();
const args = require('minimist')(process.argv.slice(2));

if (args.port) {
  const port = parseInt(args.port);
  app.server.setPort(port);
}

/**
 *
 * Configure cron job to mine for events at minute 0 past every 12th hour.
 */
if (process.env && process.env.pm_id) {
  if (parseInt(process.env.pm_id) % os.cpus().length !== 0) {
    console.log('[-] in workder cluster.');
  } else {
    // const job = new CronJob('*/2 * * * *', () => { // every 2 minutes
    const job = new CronJob('0 */12 * * *', () => { // every 12 hours
      TicketMaster.fetch();
      //  spawn(join(process.cwd(), 'node_modules/ts-node/dist/bin.js'), [join(process.cwd(), 'src/providers/index.ts')]);
      const now = new Date().toISOString();
      console.log('[+] automatic mining job started at ' + now);
    }, undefined, true, 'America/New_York');

    // run stat job script
    job.start();
  }
}

/**
 *
 *
 * Start app
 */
app.start();
