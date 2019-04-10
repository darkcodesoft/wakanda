import {
    find,
    logout,
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

router.get('/', find) // secure
router.get('/logout', logout)
router.post('/login', urlEncodeParser, login)
router.get('/:id', detail) // secure
router.post('/create', urlEncodeParser, create)
router.put('/:id', auth, update) // secure
router.delete('/:id', auth, remove) // secure

export default router