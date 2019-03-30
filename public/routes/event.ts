import * as controller from '../../src/controllers/EventController'
import Server from '../server'
const server = Server.static()

server.router.get('/event', controller.find)
server.router.get('/event/fetch', controller.fetch) // secure

server.router.get('/event/:id', controller.detail)
server.router.put('/event/:id', controller.update) // secure
server.router.delete('/event/:id', controller.remove) // secure