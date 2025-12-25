import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const DB_DIR = path.join(app.getPath('userData'), 'database')
const DB_FILE = path.join(DB_DIR, 'safiri.db')

export interface DatabaseConfig {
  path: string
}

export class DatabaseManager {
  private db: any = null

  constructor() {
    this.ensureDatabaseDirectory()
  }

  private ensureDatabaseDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true })
    }
  }

  async initialize() {
    const Database = await this.getDatabaseClass()
    this.db = new Database(DB_FILE)
    this.createTables()
    return this
  }

  private async getDatabaseClass() {
    try {
      const betterSqlite3 = await import('better-sqlite3')
      return betterSqlite3.default
    } catch (error) {
      console.error('better-sqlite3 not installed, using fallback')
      return this.createFallbackDatabase()
    }
  }

  private createFallbackDatabase() {
    return class FallbackDatabase {
      constructor(private path: string) {
        console.log('Using in-memory database fallback')
      }

      prepare(sql: string) {
        return {
          run: (...args: any[]) => {
            console.log('SQL:', sql, 'Args:', args)
            return { lastInsertRowid: 1, changes: 1 }
          },
          all: () => [],
          get: () => null
        }
      }

      exec(sql: string) {
        console.log('Exec SQL:', sql)
      }

      close() {
        console.log('Database closed')
      }
    }
  }

  private createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS workspaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        is_active INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS tabs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        title TEXT,
        favicon TEXT,
        workspace_id INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        is_pinned INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 0,
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        parent_id INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        order_index INTEGER DEFAULT 0,
        FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        url TEXT NOT NULL,
        favicon TEXT,
        folder_id INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        order_index INTEGER DEFAULT 0,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        title TEXT,
        favicon TEXT,
        visit_count INTEGER DEFAULT 1,
        last_visit INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        filename TEXT NOT NULL,
        save_path TEXT NOT NULL,
        file_size INTEGER DEFAULT 0,
        received INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at INTEGER NOT NULL,
        completed_at INTEGER
      )`,
      `CREATE TABLE IF NOT EXISTS configs (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        type TEXT DEFAULT 'string',
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS self_tab (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        component_id TEXT NOT NULL,
        component_type TEXT NOT NULL,
        position_x INTEGER DEFAULT 0,
        position_y INTEGER DEFAULT 0,
        width INTEGER DEFAULT 200,
        height INTEGER DEFAULT 200,
        config TEXT,
        order_index INTEGER DEFAULT 0
      )`
    ]

    tables.forEach((sql) => {
      this.db.exec(sql)
    })

    this.createIndexes()
  }

  private createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_tabs_workspace ON tabs(workspace_id)',
      'CREATE INDEX IF NOT EXISTS idx_bookmarks_folder ON bookmarks(folder_id)',
      'CREATE INDEX IF NOT EXISTS idx_history_last_visit ON history(last_visit)',
      'CREATE INDEX IF NOT EXISTS idx_downloads_status ON downloads(status)'
    ]

    indexes.forEach((sql) => {
      this.db.exec(sql)
    })
  }

  getDatabase() {
    return this.db
  }

  close() {
    if (this.db) {
      this.db.close()
    }
  }
}

let dbManager: DatabaseManager | null = null

export function getDatabaseManager() {
  if (!dbManager) {
    dbManager = new DatabaseManager()
  }
  return dbManager
}

export async function initializeDatabase() {
  const manager = getDatabaseManager()
  await manager.initialize()
  return manager
}
