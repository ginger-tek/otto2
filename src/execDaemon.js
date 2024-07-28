import { executeJob } from './utils.js'
import { listScheduled } from './svc/jobs.js'

function loop() {
  const cur = new Date(new Date().setMilliseconds(0))
  const jobs = listScheduled()
  for (let job of jobs) {
    if (job.startTime == cur.toISOString())
      executeJob(job)
  }
  setTimeout(loop, 1000 - new Date().getMilliseconds())
}

setTimeout(loop, 1000 - new Date().getMilliseconds())