import { dashboard, event, user, update } from '../../src/controllers/AdminController'
import bodyParser from 'body-parser'
import express from 'express'

const router = express.Router()

router.get('/', dashboard)
router.get('/event', event)
router.get('/event/:id', event)
router.get('event/update', update) // secure
router.get('/user', user)
router.get('/user/:id', user)

export default router
