import { dashboard, event, user, update } from '../../src/controllers/AdminController'
import { create, login, logout, auth } from '../../src/controllers/UserController'
import express from 'express'

const router = express.Router()

router.get('/', dashboard)
router.post('/register', create)
router.post('/login', login)
router.post('/logout', logout)
router.get('/event', event)
router.get('/event/:id', event)
router.get('event/update', update) // secure
router.get('/user', user)
router.get('/user/:id', user)

export default router
