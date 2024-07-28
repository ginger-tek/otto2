import db from './db.js'
import { v4 as uuidv4 } from 'uuid'

export function create(defId) {
  try {
    const id = uuidv4()
    db
      .prepare(`insert into jobs(id, defId) values(:id, :defId)`)
      .run({ id, defId })
    return [null, read(id)]
  } catch (ex) {
    return ['Failed to create job', null]
  }
}

export function read(id) {
  return db
    .prepare(`select *
      from jobs where id = :id`)
    .get({ id })
}

export function list() {
  return db
    .prepare(`select j.*, d.name as defName
      from jobs j
      left join definitions d on d.id = j.defId`)
    .all()
}

export function listScheduled() {
  return db
    .prepare(`select j.*, d.name as defName
      from jobs j
      left join definitions d on d.id = j.defId
      where j.status = 'Scheduled'`)
    .all()
}

export function findByDefinition(defId, startTime) {
  return db
    .prepare(`select *
      from jobs
      where defId = :defId
      and startTime = :startTime`)
    .get({ defId, startTime })
}

export function update({ id, defName, created, updated, ...fields }) {
  try {
    db
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
    const { changes } = db
      .prepare(`delete from jobs where id = :id limit 1`)
      .run({ id })
    return [null, changes == 1]
  } catch (ex) {
    return ['Failed to delete job', null]
  }
}