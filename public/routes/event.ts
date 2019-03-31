import {
    find,
    fetch,
    detail,
    update,
    remove
} from '../../src/controllers/EventController'

import { auth } from '../../src/controllers/UserController'
import Server from '../server'

const server = Server.static()

server.router.get('/event', find)
server.router.get('/event/fetch', auth, fetch) // secure

server.router.get('/event/:id', detail)
server.router.post('/event/:id', update) // secure
server.router.delete('/event/:id', auth, remove) // secure