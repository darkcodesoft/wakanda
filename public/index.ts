import App from '../src/bootstrap/app'
import { CronJob } from 'cron'
import { spawn } from 'child_process'
import { join } from 'path'

/**
 *
 * Get app singleton and process passed arguments to retrieve
 * port number if given.
 */
const app  = App.static()
const args = require('minimist')(process.argv.slice(2))

if(!!args.port) {
    let port = parseInt(args.port)
    app.server.setPort(port)
}

/**
 *
 * Configure cron job to mine for events everyday at 3:00 am.
 */
const job = new CronJob('0 3 * * *', () => {
    spawn(join(process.cwd(), 'node_modules/ts-node/dist/bin.js'), [join(process.cwd(), 'src/providers/index.ts')])
    const now = new Date().toISOString()
    console.log('[+] automatic mining job started at ' + now);
}, undefined, true, 'America/New_York')

/**
 *
 * Start job
 */
job.start()


/**
 *
 * Start app
 */
app.start()
