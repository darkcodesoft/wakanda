import App from '../src/bootstrap/app'
const app  = App.static()
const args = require('minimist')(process.argv.slice(2))

if(!!args.port) {
    let port = parseInt(args.port)
    app.server.setPort(port)
}

app.main()