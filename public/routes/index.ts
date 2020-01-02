import express from 'express'
import event from './event'
import user from './user'
import admin from './admin'

const router = express.Router()

router.use('/admin', admin)
router.use('/event', event)
router.use('/user', user)

export default router