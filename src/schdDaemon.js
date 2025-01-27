import { scheduleDefinition, parseSchedule, delayMs } from './utils.js'
import { list } from './svc/definitions.js'

async function loop() {
  while (true) {
    const cur = new Date(new Date().setMilliseconds(0))
    const defs = list({ enabled: 1 }, true)
    for (let def of defs) {
      const schdDateTime = parseSchedule(def)
      if (schdDateTime && schdDateTime >= cur)
        scheduleDefinition(def, schdDateTime)
    }
    await delayMs(1000 - new Date().getMilliseconds())
  }
}

setTimeout(loop, 1000 - new Date().getMilliseconds())