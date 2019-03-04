// const args = require('minimist')(process.argv.slice(2))
// import App from '../src/bootstrap/app'
// const app  = App.static()

// if(!!args.port) {
//     let port = parseInt(args.port)
//     app.server.setPort(port)
// }

// app.main()

import TicketMaster from '../src/providers/TicketMaster/TicketMaster'
let provider = TicketMaster.static()
provider.fetch()