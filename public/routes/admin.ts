import { dashboard, event, user, update } from '../../src/controllers/AdminController'
import { create, login, logout, auth } from '../../src/controllers/UserController'
import express from 'express'

const router = express.Router()

router.get('/', dashboard)
router.post('/register', create)
router.post('/login', login)
router.post('/logout', logout)
router.get('/event', auth, event)
router.get('/event/:id', auth, event)
router.get('event/update', auth, update) // secure
router.get('/user', auth, user)
router.get('/user/:id', auth, user)

export default router
