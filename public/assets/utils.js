export async function api(u, m, b) {
  const r = await fetch(`/api/${u}`, {
    method: m || 'GET',
    headers: { 'content-type': 'application/json' },
    body: b ? JSON.stringify(b) : null
  })
  const d = await r.json()
  return r.ok ? d : Promise.reject(d)
}

export function toLocal(str = null) {
  return str ? new Date(str + (!str.match(/Z$/) ? 'Z' : '')).toLocaleString() : '...'
}

export function toTimeStr(n = 0) {
  let s = Math.floor(n / 1000) % 60
  let m = Math.floor(n / 1000 / 60) % 60
  let h = Math.floor(n / 1000 / 60 / 60)
  const pad = (n, p = 2) => ('' + n).padStart(p, '0')
  return [h, m, s].map(n => pad(n)).join(':') + `.${pad(n % 1000, 3)}`
}

export function getTimeZoneOffsets() {
  const timezoneOffsets = []
  for (let offset = -12 * 60; offset <= 14 * 60; offset += 30) {
    const date = new Date(Date.UTC(null, 0, 1, 0, 0, 0, 0))
    date.setMinutes(date.getMinutes() + offset)
    const formattedOffset = (offset >= 0 ? '+' : '-') +
      Math.abs(Math.ceil(offset / 60)).toString().padStart(2, '0') + ':' +
      (Math.abs(offset) % 60).toString().padStart(2, '0')
    timezoneOffsets.push({
      offset: formattedOffset,
      timeZone: 'UTC' + formattedOffset
    })
  }
  return timezoneOffsets
}