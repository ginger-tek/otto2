import express from 'express'
import morgan from 'morgan'
import fs from 'fs'
import history from 'connect-history-api-fallback'
import { spawn } from 'child_process'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { createLogStream, createLogger } from './src/utils.js'
import pkg from './package.json' with { type: 'json' }

if (!fs.existsSync('data')) {
  fs.mkdirSync('data/tmp', { recursive: true })
  fs.mkdirSync('data/logs', { recursive: true })
  fs.mkdirSync('data/logs/jobs', { recursive: true })
}

import apiController from './src/cntlr/api.js'
import { list } from './src/svc/jobs.js'

const port = 4000
const app = express()

const mainLog = createLogger(createLogStream('main.log'))
const execLog = createLogger(createLogStream('exec.log'))
const schdLog = createLogger(createLogStream('schd.log'))

mainLog.info('--------------------')
mainLog.info(`Otto v${pkg.version}`)

const execd = spawn('node', ['./src/execDaemon.js'], {
  cwd: process.cwd(),
  shell: process.env.comspec
})
mainLog.info(`Executor service running, PID: ${execd.pid}`)
execd.stdout.on('data', data => execLog.info(`${data || ''}`))
execd.stderr.on('data', data => execLog.error(`${data || ''}`))
execd.on('close', code => execLog.info(`Process has exited with code ${code || ''}`))

const schdd = spawn('node', ['./src/schdDaemon.js'], {
  cwd: process.cwd(),
  shell: process.env.comspec
})
mainLog.info(`Scheduler service running, PID: ${schdd.pid}`)
schdd.stdout.on('data', data => schdLog.info(`${data || ''}`))
schdd.stderr.on('data', data => schdLog.error(`${data || ''}`))
schdd.on('close', code => schdLog.info(`Process has exited with code ${code || ''}`))

const http = createServer(app)
const io = new Server(http)
io.on('connection', socket => {
  const sendJobData = async () => {
    const jobs = list()
    socket.emit('monitor-data', jobs)
    setTimeout(sendJobData, 1000 - new Date().getMilliseconds())
  }
  socket.on('get-monitor', sendJobData)
  sendJobData()
})
mainLog.info(`Websocket service started`)

app.use(morgan('short', { stream: createLogStream('access.log') }))
app.use(express.json())
app.use('/api', apiController)
app.use(history())
app.use(express.static('public'))

http.listen(port, () => {
  mainLog.info(`Web service started on http://localhost:${port}`)
})