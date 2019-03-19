import * as controller from '../../src/controllers/UserController'
import Server from '../server'
import bodyParser from 'body-parser'
const server = Server.static()
const urlEncodeParser = bodyParser.urlencoded({ extended: false })

server.router.get('/user', controller.find)
server.router.get('/user/login', controller.loginForm)
server.router.post('/user/login', urlEncodeParser, controller.login)
server.router.post('/user/create', urlEncodeParser, controller.create)
server.router.get('/user/:id', controller.detail)
