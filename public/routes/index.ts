import express from 'express'
import events from './event'
import users from './user'
import admin from './admin'

const router = express.Router()

router.use('/admin', admin)
router.use('/event', events)
router.use('/user', users)

export default router