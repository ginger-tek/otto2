import { Router } from 'express'
import definitions from './definitions.js'
import jobs from './jobs.js'
import executors from './executors.js'

const router = Router()

router.use('/definitions', definitions)
router.use('/jobs', jobs)
router.use('/executors', executors)

export default router