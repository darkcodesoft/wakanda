import { find, detail, update, remove } from '../../src/controllers/EventController'
import { auth } from '../../src/controllers/UserController'
import bodyParser from 'body-parser'
import express from 'express'

const urlEncodeParser = bodyParser.urlencoded({ extended: false })
const router = express.Router()

router.get('/', find)
router.get('/:id', detail)
router.post('/:id', auth, urlEncodeParser, update) // secure
router.put('/:id', auth, urlEncodeParser, update) // secure
router.delete('/:id', auth, remove) // secure

export default router