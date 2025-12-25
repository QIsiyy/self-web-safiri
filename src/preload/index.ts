import { contextBridge, ipcRenderer } from 'electron'

const api = {
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version')
  },
  database: {
    get: (tableName: string, id: number) => ipcRenderer.invoke('database:get', tableName, id),
    getAll: (tableName: string) => ipcRenderer.invoke('database:getAll', tableName),
    insert: (tableName: string, data: any) => ipcRenderer.invoke('database:insert', tableName, data),
    update: (tableName: string, id: number, data: any) => ipcRenderer.invoke('database:update', tableName, id, data),
    delete: (tableName: string, id: number) => ipcRenderer.invoke('database:delete', tableName, id),
    query: (tableName: string, query: any) => ipcRenderer.invoke('database:query', tableName, query)
  },
  workspace: {
    create: (workspace: any) => ipcRenderer.invoke('workspace:create', workspace),
    getAll: () => ipcRenderer.invoke('workspace:getAll'),
    update: (id: number, workspace: any) => ipcRenderer.invoke('workspace:update', id, workspace),
    delete: (id: number) => ipcRenderer.invoke('workspace:delete', id)
  },
  tab: {
    create: (tab: any) => ipcRenderer.invoke('tab:create', tab),
    getByWorkspace: (workspaceId: number) => ipcRenderer.invoke('tab:getByWorkspace', workspaceId),
    update: (id: number, tab: any) => ipcRenderer.invoke('tab:update', id, tab),
    delete: (id: number) => ipcRenderer.invoke('tab:delete', id)
  }
}

contextBridge.exposeInMainWorld('electronAPI', api)

export type ElectronAPI = typeof api
