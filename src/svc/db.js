import Database from 'better-sqlite3'
import fs from 'fs'

const db = new Database('data/otto.db')
const schema = fs.readFileSync('schema.sql', { encoding: 'utf-8' })

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(schema)

export default db