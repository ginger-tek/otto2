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
  return str ? new Date(str).toLocaleString() : '...'
}

export function toTimeStr(n = 0) {
  let s = Math.floor(n / 1000) % 60
  let m = Math.floor(n / 1000 / 60) % 60
  let h = Math.floor(n / 1000 / 60 / 60)
  const pad = (n, p = 2) => ('' + n).padStart(p, '0')
  return [h, m, s].map(n => pad(n)).join(':') + `.${pad(n % 1000, 3)}`
}

export function getTimezonesWithOffsets() {
  const results = []
  for (let timeZone of Intl.supportedValuesOf("timeZone")) {
    const options = { timeZone, timeZoneName: "longOffset" }
    const dateText = Intl.DateTimeFormat([], options).format(new Date())
    let timezoneString = dateText.split(" ")[1].slice(3) || "+0"
    let offsetNum = parseInt(timezoneString.split(":")[0]) * 60
    if (timezoneString.includes(":"))
      offsetNum = offsetNum + parseInt(timezoneString.split(":")[1])
    let offset = offsetNum / 60
    let offsetRawNum = Math.abs(offset)
    let mins = !Number.isInteger(offsetRawNum) ? Math.abs(offsetNum) % 60 : 0
    let hours = Math.floor(offsetRawNum)
    offset = `${offset < 0 ? "-" : "+"}${("" + hours).padStart(2, "0")}:${("" + mins).padStart(2, "0")}`
    results.push({ timeZone, offsetNum, offset })
  }
  return results
    .filter((tz, x, s) => x === s.findIndex(o => o.timeZone.match(new RegExp(`(${tz.timeZone.split('\/')[0]}|New_York)`)) && o.offset == tz.offset))
    .toSorted((a, b) => a.offsetNum - b.offsetNum)
}