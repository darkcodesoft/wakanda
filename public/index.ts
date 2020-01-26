import App from '../src/bootstrap/app'
import { CronJob } from 'cron'
import { spawn } from 'child_process'
import { join } from 'path'

const app  = App.static()
const args = require('minimist')(process.argv.slice(2))

if(!!args.port) {
    let port = parseInt(args.port)
    app.server.setPort(port)
}

const job = new CronJob('0 8 * * *', () => {
    spawn(join(process.cwd(), 'node_modules/ts-node/dist/bin.js'), [join(process.cwd(), 'src/providers/index.ts')])
    const now = new Date().toISOString()
    console.log('[+] Cron job started' + now);
}, undefined, true, 'America/New_York')

job.start()

app.main()
