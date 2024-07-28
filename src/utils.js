import { spawn } from 'child_process'
import * as jobs from './svc/jobs.js'
import * as execs from './svc/executors.js'
import fs from 'fs'
import { createStream } from 'rotating-file-stream'

const timeRgx = /^(\d{2}):(\d{2})$/
const everyRgx = /^(\d{1})[stndrth]{2} (\w+)$/i
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export function createLogStream(fileName) {
  return createStream(fileName, {
    size: '10M',
    interval: '1d',
    maxFiles: 50,
    path: 'data/logs'
  })
}

export function createLogger(stream) {
  return Object.assign({}, {
    info(msg) {
      const date = new Date().toISOString()
      stream.write(`${date} [INFO]  ${msg}\n`)
    },
    error(msg) {
      const date = new Date().toISOString()
      stream.write(`${date} [ERROR] ${msg}\n`)
    }
  })
}

export function timeToNextDate(expr, cur = new Date()) {
  const [_m, hours, mins] = expr.match(timeRgx)
  const diff = (hours * 60 * 60) + (mins * 60) * 1000
  let date = new Date(Math.round(cur.getTime() / diff) * diff)
  if (date < cur)
    date = new Date(Math.ceil((cur.getTime() / diff)) * diff + diff)
  return date
}

export function dayIntToNextDate(expr, cur = new Date()) {
  let [_m, dayInt, dayName] = expr.match(everyRgx)
  dayName = dayName.slice(0, 3)
  const start = new Date(cur.getFullYear(), cur.getMonth(), 1, 0, 0, 0, 0)
  if (days.includes(dayName)) {
    while (days[start.getDay()] != dayName)
      start.setDate(start.getDate() + 1)
  }
  return new Date(start.setDate(start.getDate() + ((dayInt - 1) * 7)))
}

export function parseSchedule(def) {
  const dt = [def.schdStartDate, def.schdStartTime].join(' ').trim()
  let date = dt ? new Date(Date.parse(dt)) : new Date(new Date(new Date().setSeconds(0)).setMilliseconds(0))
  if (new Date(Date.parse(def.endDate + ' ' + def.endTime)) < date)
    return false
  if (def.schdInterval) {
    if (timeRgx.test(def.schdInterval)) {
      date = timeToNextDate(def.schdInterval, date)
    } else if (everyRgx.test(def.schdInterval))
      date = dayIntToNextDate(def.schdInterval, date)
  }
  return date
}

export function scheduleDefinition(def, dateTime = new Date()) {
  const exists = jobs.findByDefinition(def.id, dateTime.toISOString())
  if (exists) return
  const exec = execs.read(def.execId)
  let [createError, job] = jobs.create(def.id)
  if (createError)
    return console.error(`Failed to create job for ${def.name}`)
  console.log(`Scheduling definition '${def.name}' via job ${job.id}`)
  job.startTime = dateTime.toISOString()
  job.execPath = exec.path
  job.stdLog = `data/logs/jobs/${job.id}_${def.name}.log`
  job.errLog = `data/logs/jobs/${job.id}_${def.name}.err`
  if (!fs.existsSync(def.script)) {
    job.scriptPath = `data/tmp/${def.id}${Date.now()}.script`
    fs.writeFileSync(script, fs.readFileSync(def.script, { encoding: 'utf-8' }))
  } else job.scriptPath = def.script
  const schdJob = jobs.update(job)
  if (schdJob[0])
    return console.error(`Failed to schedule job for ${def.name}`)
  return schdJob[1]
}

export async function executeJob(job) {
  console.log(`Submitting job ${job.id}`)
  const proc = spawn(job.scriptPath, [job.scriptArgs], {
    shell: job.execPath
  })
  job.status = 'Running'
  let [runError] = jobs.update(job)
  if (runError)
    console.error('Failed to update job status to Running')
  proc.stdout.on('data', data => {
    fs.appendFileSync(job.stdLog, `${data || ''}`)
  })
  proc.stderr.on('data', data => {
    fs.appendFileSync(job.errLog, `${data || ''}`)
  })
  proc.on('close', code => {
    job.endTime = new Date().toISOString()
    job.elapsed = new Date(job.endTime) - new Date(job.startTime)
    job.exitCode = code
    job.status = code == 0 ? 'Completed' : 'Failed'
    let [doneError] = jobs.update(job)
    if (doneError)
      console.error(`Failed to update job status to ${job.status}`)
    if (job.scriptPath.match(/\.script$/))
      fs.unlinkSync(job.scriptPath)
  })
  return job
}