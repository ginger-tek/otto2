import { connect } from './db.js'
import { v4 as uuidv4 } from 'uuid'

export function create(name) {
  try {
    const id = uuidv4()
    connect()
      .prepare(`insert into executors(id, name) values(:id, :name)`)
      .run({ id, name })
    return [null, read(id)]
  } catch (ex) {
    if (ex.code == 'SQLITE_CONSTRAINT_UNIQUE')
      return ['Name must be unique', null]
    return ['Failed to create executor', null]
  }
}

export function read(id) {
  return connect()
    .prepare(`select *
      from executors where id = :id`)
    .get({ id })
}

export function list(filters = {}) {
  let where = []
  if (filters.enabled)
    where.push(`enabled = :enabled`)
  return connect()
    .prepare(`select id, name, created, updated
      from executors
      ${where.length ? 'where ' + where.join(' and ') : ''}
      limit 50`)
    .all(filters)
}

export function update({ id, created, updated, ...fields }) {
  try {
    connect()
      .prepare(`update executors set
        ${Object.keys(fields).map(f => `${f} = :${f}`).join(`,\n`)},
        updated = current_timestamp
        where id = :id`)
      .run({ id, ...fields })
    return [null, read(id)]
  } catch (ex) {
    return ['Failed to update executor', null]
  }
}

export function destroy(id) {
  try {
    const { changes } = connect()
      .prepare(`delete from executors where id = :id limit 1`)
      .run({ id })
    return [null, changes == 1]
  } catch (ex) {
    return ['Failed to delete executor', null]
  }
}