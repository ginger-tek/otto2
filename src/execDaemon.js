import { executeJob, delayMs } from './utils.js'
import { listScheduled } from './svc/jobs.js'

async function loop() {
  while (true) {
    const cur = new Date(new Date().setMilliseconds(0))
    const jobs = listScheduled()
    for (let job of jobs) {
      if (job.startTime == cur.toISOString())
        executeJob(job)
    }
    await delayMs(1000 - new Date().getMilliseconds())
  }
}

setTimeout(loop, 1000 - new Date().getMilliseconds())