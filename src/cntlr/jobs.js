import { Router } from 'express'
import { create, list, read, update, destroy } from '../svc/jobs.js'

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

router.get('/:id', (req, res) => {
  res.json(read(req.params.id))
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