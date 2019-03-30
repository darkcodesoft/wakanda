import * as controller from '../../src/controllers/UserController'
import Server from '../server'
import bodyParser from 'body-parser'
const server = Server.static()
const urlEncodeParser = bodyParser.urlencoded({ extended: false })

server.router.get('/user', controller.find) // secure
server.router.get('/user/login', controller.loginForm)
server.router.get('/user/logout', controller.logout)
server.router.post('/user/login', urlEncodeParser, controller.login)

server.router.post('/user/create', urlEncodeParser, controller.create)
server.router.get('/user/:id', controller.detail) // secure
server.router.put('/user/:id', controller.update) // secure
server.router.delete('/user/:id', controller.remove) // secure
