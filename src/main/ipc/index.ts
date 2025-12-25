import { ipcMain, app } from 'electron'
import { initializeDatabase } from '../database'

export function registerIPCHandlers() {
  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })

  initializeDatabase().then(() => {
    console.log('Database initialized')
  }).catch((error) => {
    console.error('Failed to initialize database:', error)
  })

  ipcMain.handle('database:get', async (_event, tableName: string, id: number) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
    return stmt.get(id)
  })

  ipcMain.handle('database:getAll', async (_event, tableName: string) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const stmt = db.prepare(`SELECT * FROM ${tableName}`)
    return stmt.all()
  })

  ipcMain.handle('database:insert', async (_event, tableName: string, data: any) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => '?').join(', ')
    const stmt = db.prepare(`INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`)
    return stmt.run(...values)
  })

  ipcMain.handle('database:update', async (_event, tableName: string, id: number, data: any) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const keys = Object.keys(data)
    const values = Object.values(data)
    const setClause = keys.map((key) => `${key} = ?`).join(', ')
    const stmt = db.prepare(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`)
    return stmt.run(...values, id)
  })

  ipcMain.handle('database:delete', async (_event, tableName: string, id: number) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const stmt = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`)
    return stmt.run(id)
  })

  ipcMain.handle('database:query', async (_event, tableName: string, query: any) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const whereClause = Object.keys(query).map((key) => `${key} = ?`).join(' AND ')
    const values = Object.values(query)
    const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE ${whereClause}`)
    return stmt.all(...values)
  })

  ipcMain.handle('workspace:create', async (_event, workspace: any) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const now = Date.now()
    const stmt = db.prepare(`
      INSERT INTO workspaces (name, icon, color, created_at, updated_at, is_active, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(workspace.name, workspace.icon || null, workspace.color || null, now, now, 0, 0)
  })

  ipcMain.handle('workspace:getAll', async () => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const stmt = db.prepare('SELECT * FROM workspaces ORDER BY order_index ASC')
    return stmt.all()
  })

  ipcMain.handle('workspace:update', async (_event, id: number, workspace: any) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const now = Date.now()
    const stmt = db.prepare(`
      UPDATE workspaces 
      SET name = ?, icon = ?, color = ?, updated_at = ?
      WHERE id = ?
    `)
    return stmt.run(workspace.name, workspace.icon || null, workspace.color || null, now, id)
  })

  ipcMain.handle('workspace:delete', async (_event, id: number) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const stmt = db.prepare('DELETE FROM workspaces WHERE id = ?')
    return stmt.run(id)
  })

  ipcMain.handle('tab:create', async (_event, tab: any) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const now = Date.now()
    const stmt = db.prepare(`
      INSERT INTO tabs (url, title, favicon, workspace_id, created_at, updated_at, is_pinned, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      tab.url,
      tab.title || null,
      tab.favicon || null,
      tab.workspaceId || null,
      now,
      now,
      tab.isPinned ? 1 : 0,
      tab.isActive ? 1 : 0
    )
  })

  ipcMain.handle('tab:getByWorkspace', async (_event, workspaceId: number) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const stmt = db.prepare('SELECT * FROM tabs WHERE workspace_id = ? ORDER BY created_at ASC')
    return stmt.all(workspaceId)
  })

  ipcMain.handle('tab:update', async (_event, id: number, tab: any) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const now = Date.now()
    const stmt = db.prepare(`
      UPDATE tabs 
      SET url = ?, title = ?, favicon = ?, is_pinned = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `)
    return stmt.run(
      tab.url,
      tab.title || null,
      tab.favicon || null,
      tab.isPinned ? 1 : 0,
      tab.isActive ? 1 : 0,
      now,
      id
    )
  })

  ipcMain.handle('tab:delete', async (_event, id: number) => {
    const db = (await import('../database')).getDatabaseManager().getDatabase()
    const stmt = db.prepare('DELETE FROM tabs WHERE id = ?')
    return stmt.run(id)
  })

  console.log('IPC handlers registered')
}
