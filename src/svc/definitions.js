import db from './db.js'
import { v4 as uuidv4 } from 'uuid'

export function create(name) {
  try {
    const id = uuidv4()
    db
      .prepare(`insert into definitions(id, name) values(:id, :name)`)
      .run({ id, name })
    return [null, read(id)]
  } catch (ex) {
    if (ex.code == 'SQLITE_CONSTRAINT_UNIQUE')
      return ['Name must be unique', null]
    return ['Failed to create definition', null]
  }
}

export function read(id) {
  return db
    .prepare(`select *
      from definitions where id = :id`)
    .get({ id })
}

export function list(filters = {}, full = false) {
  let where = []
  if (filters.enabled)
    where.push(`enabled = :enabled`)
  const stmt = db
    .prepare(`select ${full ? '*' : 'id, name, created, updated'}
      from definitions
      ${where.length ? 'where ' + where.join(' and ') : ''}
      limit 50`)
  if (Object.keys(filters).length)
    return stmt.all(filters)
  return stmt.all()
}

export function listJobs(id, filters = {}) {
  let where = []
  if (filters.status)
    where.push(`status = :status`)
  if (filters.start)
    where.push(`startTime = :start`)
  if (end)
    where.push(`endTime = :end`)
  return db
    .prepare(`select *
      from jobs where defId = :id
      ${where.length ? where.join(' and ') : ''}
      limit 50`)
    .all({ id, ...filters })
}

export function update({ id, created, updated, ...fields }) {
  try {
    db
      .prepare(`update definitions set
        ${Object.keys(fields).map(f => `${f} = :${f}`).join(`,\n`)},
        updated = current_timestamp
        where id = :id`)
      .run({ id, ...fields })
    return [null, read(id)]
  } catch (ex) {
    return ['Failed to update definition', null]
  }
}

export function destroy(id) {
  try {
    const { changes } = db
      .prepare(`delete from definition where id = :id limit 1`)
      .run({ id })
    return [null, changes == 1]
  } catch (ex) {
    return ['Failed to delete definition', null]
  }
}