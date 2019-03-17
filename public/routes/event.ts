import EventController from '../../src/controllers/EventController'
import Server from '../server'
const controller = EventController.static()
const server = Server.static()

server.router.get('/event', controller.find)
server.router.get('/event/fetch', controller.fetch)
server.router.get('/event/:id', controller.detail)