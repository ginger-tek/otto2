import { connect } from './db.js'
import { v4 as uuidv4 } from 'uuid'

export function create(defId) {
  try {
    const id = uuidv4()
    connect()
      .prepare(`insert into jobs(id, defId) values(:id, :defId)`)
      .run({ id, defId })
    return [null, read(id)]
  } catch (ex) {
    return ['Failed to create job', null]
  }
}

export function read(id) {
  return connect()
    .prepare(`select *
      from jobs where id = :id`)
    .get({ id })
}

export function list() {
  return connect()
    .prepare(`select j.*, d.name as defName
      from jobs j
      left join definitions d on d.id = j.defId`)
    .all()
}

export function listHistory() {
  return connect()
    .prepare(`select j.*, d.name as defName
      from jobs j
      left join definitions d on d.id = j.defId
      where j.status in ('Completed','Failed')
      order by j.updated desc`)
    .all()
}

export function listScheduled() {
  return connect()
    .prepare(`select j.*, d.name as defName
      from jobs j
      left join definitions d on d.id = j.defId
      where j.status = 'Scheduled'`)
    .all()
}

export function listMonitor() {
  return connect()
    .prepare(`select j.*, d.name as defName
      from jobs j
      left join definitions d on d.id = j.defId
      where j.created > datetime('now','-10 minutes');`)
    .all()
}

export function findByDefinition(defId, startTime) {
  return connect()
    .prepare(`select *
      from jobs
      where defId = :defId
      and startTime = :startTime`)
    .get({ defId, startTime })
}

export function update({ id, defName, created, updated, ...fields }) {
  try {
    connect()
      .prepare(`update jobs set
        ${Object.keys(fields).map(f => `${f} = :${f}`).join(`,\n`)},
        updated = current_timestamp
        where id = :id`)
      .run({ id, ...fields })
    return [null, read(id)]
  } catch (ex) {
    return ['Failed to update job', null]
  }
}

export function destroy(id) {
  try {
    const { changes } = connect()
      .prepare(`delete from jobs where id = :id limit 1`)
      .run({ id })
    return [null, changes == 1]
  } catch (ex) {
    return ['Failed to delete job', null]
  }
}