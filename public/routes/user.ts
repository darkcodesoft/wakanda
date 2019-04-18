import {
    find,
    login,
    create,
    update,
    remove,
    detail,
    auth
} from '../../src/controllers/UserController'
import bodyParser from 'body-parser'
import express from 'express'

const urlEncodeParser = bodyParser.urlencoded({ extended: false })
const router = express.Router()

router.get('/', auth, find)
router.post('/login', urlEncodeParser, login)
router.get('/:id', auth, detail)
router.post('/create', urlEncodeParser, create)
router.put('/:id', auth, update)
router.delete('/:id', auth, remove)

export default router