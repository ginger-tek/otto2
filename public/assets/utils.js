export async function api(u, m, b) {
  const r = await fetch(`/api${u}`, {
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