import { index, event, user, mine } from '../../src/controllers/AdminController'
import UserController from '../../src/controllers/UserController'
import EventController from '../../src/controllers/EventController'
import express from 'express'
import bodyParser from 'body-parser'

const router = express.Router()
const urlEncodeParser = bodyParser.urlencoded({ extended: false })

router.get('/', index)

// Use arrow functions in controller class methods to perserve `this` context
router.post('/register', (req, res) => {
    UserController.create(req, res)
})

router.post('/login', UserController.login)
router.get('/event', UserController.auth, event)
router.get('/event/:id', UserController.auth, event)

// update
router.put('/event/:id', UserController.auth, urlEncodeParser, (req, res) => {
    EventController.update(req, res)
})

// delete
router.delete('/event/:id', UserController.auth, urlEncodeParser, (req, res) => {
    EventController.remove(req, res)
})

router.get('/user', UserController.auth, user)
router.get('/user/:id', UserController.auth, user)


router.get('/mine', UserController.auth, mine)

export default router
