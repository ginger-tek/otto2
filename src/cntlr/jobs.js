import { Router } from 'express'
import { create, list, listHistory, read, update, destroy } from '../svc/jobs.js'
import fs from 'fs'

const router = Router()

router.post('/', (req, res) => {
  const { name } = req.body
  const [error, def] = create(name)
  if (error) res.status(500).json({ error })
  else res.json(def)
})

router.get('/', (_req, res) => {
  res.json(list())
})

router.get('/history', (req, res) => {
  res.json(listHistory(req.query.date || null))
})

router.get('/:id', (req, res) => {
  res.json(read(req.params.id))
})

router.get('/:id/logs/std', (req, res) => {
  const job = read(req.params.id)
  res.send(fs.existsSync(job.stdLog) ? fs.readFileSync(job.stdLog, { encoding: 'utf-8' }) : '')
})

router.get('/:id/logs/err', (req, res) => {
  const job = read(req.params.id)
  res.send(fs.existsSync(job.errLog) ? fs.readFileSync(job.errLog, { encoding: 'utf-8' }) : '')
})

router.put('/', (req, res) => {
  const [error, result] = update(req.body)
  if (error) res.status(500).json({ error })
  else res.json(result)
})

router.delete('/:id', (req, res) => {
  const [error, result] = destroy(req.params.id)
  if (error) res.status(500).json({ error })
  else res.json({ result })
})

export default router