import Database from 'better-sqlite3'
import fs from 'fs'

if (!fs.existsSync('data'))
  fs.mkdirSync('data')

export function connect() {
  const db = new Database('data/otto.db')
  const schema = fs.readFileSync('schema.sql', { encoding: 'utf-8' })
  db.pragma('journal_mode=WAL')
  db.pragma('foreign_keys = ON')
  db.exec(schema)
  return db
}

export default connect