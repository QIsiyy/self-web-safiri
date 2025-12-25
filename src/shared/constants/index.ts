export const APP_NAME = 'Self Web Safiri'
export const APP_VERSION = '0.1.0'

export const DB_NAME = 'safiri.db'

export const IPC_CHANNELS = {
  APP: {
    GET_VERSION: 'app:get-version'
  },
  DATABASE: {
    GET: 'database:get',
    GET_ALL: 'database:getAll',
    INSERT: 'database:insert',
    UPDATE: 'database:update',
    DELETE: 'database:delete',
    QUERY: 'database:query'
  },
  WORKSPACE: {
    CREATE: 'workspace:create',
    GET_ALL: 'workspace:getAll',
    UPDATE: 'workspace:update',
    DELETE: 'workspace:delete'
  },
  TAB: {
    CREATE: 'tab:create',
    GET_BY_WORKSPACE: 'tab:getByWorkspace',
    UPDATE: 'tab:update',
    DELETE: 'tab:delete'
  }
} as const

export const TABLES = {
  WORKSPACES: 'workspaces',
  TABS: 'tabs',
  FOLDERS: 'folders',
  BOOKMARKS: 'bookmarks',
  HISTORY: 'history',
  DOWNLOADS: 'downloads',
  CONFIGS: 'configs',
  SELF_TAB: 'self_tab'
} as const
