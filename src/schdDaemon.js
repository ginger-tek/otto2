import { scheduleDefinition, parseSchedule } from './utils.js'
import { list } from './svc/definitions.js'

function loop() {
  const cur = new Date()
  const defs = list({ enabled: 1 }, true)
  for (let def of defs) {
    const schdDateTime = parseSchedule(def)
    if (schdDateTime && schdDateTime >= cur)
      scheduleDefinition(def, schdDateTime)
  }
  setTimeout(loop, 1000 - new Date().getMilliseconds())
}

setTimeout(loop, 1000 - new Date().getMilliseconds())