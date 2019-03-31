import {
    find,
    loginForm,
    logout,
    login,
    create,
    update,
    remove,
    detail,
    auth
} from '../../src/controllers/UserController'

import Server from '../server'
import bodyParser from 'body-parser'

const server = Server.static()
const urlEncodeParser = bodyParser.urlencoded({ extended: false })

server.router.get('/user', auth, find) // secure
server.router.get('/user/login', loginForm)
server.router.get('/user/logout', logout)
server.router.post('/user/login', urlEncodeParser, login)

server.router.post('/user/create', urlEncodeParser, create)
server.router.get('/user/:id', detail) // secure
server.router.put('/user/:id', auth, update) // secure
server.router.delete('/user/:id', auth, remove) // secure
