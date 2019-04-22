import { index, event, user, mine } from '../../src/controllers/AdminController'
import UserController from '../../src/controllers/UserController'
import express from 'express'

const router = express.Router()

router.get('/', index)

// Use arrow functions in controller class methods to perserve `this` context
router.post('/register', (req, res) => {
    UserController.create(req, res)
})

router.post('/login', UserController.login)
router.get('/event', UserController.auth, event)
router.get('/event/:id', UserController.auth, event)
router.get('/user', UserController.auth, user)
router.get('/user/:id', UserController.auth, user)


router.get('/mine', UserController.auth, mine)

export default router
