import { find, detail, update, remove } from '../../src/controllers/EventController'
import { auth } from '../../src/controllers/UserController'
import bodyParser from 'body-parser'
import express from 'express'

const urlEncodeParser = bodyParser.urlencoded({ extended: false })
const router = express.Router()

router.get('/', auth, find)
router.get('/:id', auth, detail)
router.post('/:id', auth, urlEncodeParser, update)
router.put('/:id', auth, urlEncodeParser, update)
router.delete('/:id', auth, remove)

export default router