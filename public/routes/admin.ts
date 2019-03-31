import { dashboard, event, user } from '../../src/controllers/AdminController'
import { auth } from '../../src/controllers/UserController'

import Server from '../server'
const server = Server.static()

server.router.get('/', auth, dashboard)
server.router.get('/admin', auth, dashboard)
// events
server.router.get('/admin/event', auth, event)
server.router.get('/admin/event/filter', auth, event)
server.router.get('/admin/event/:id', auth, event)
// user
server.router.get('/admin/user', auth, user)