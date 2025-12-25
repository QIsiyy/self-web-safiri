export interface Workspace {
  id?: number
  name: string
  icon?: string
  color?: string
  createdAt?: number
  updatedAt?: number
  isActive?: number
  orderIndex?: number
}

export interface Tab {
  id?: number
  url: string
  title?: string
  favicon?: string
  workspaceId?: number
  createdAt?: number
  updatedAt?: number
  isPinned?: boolean
  isActive?: boolean
}

export interface Bookmark {
  id?: number
  title?: string
  url: string
  favicon?: string
  folderId?: number
  createdAt?: number
  updatedAt?: number
  orderIndex?: number
}

export interface Folder {
  id?: number
  name: string
  parentId?: number
  createdAt?: number
  updatedAt?: number
  orderIndex?: number
}

export interface History {
  id?: number
  url: string
  title?: string
  favicon?: string
  visitCount?: number
  lastVisit?: number
  createdAt?: number
}

export interface Download {
  id?: number
  url: string
  filename: string
  savePath: string
  fileSize?: number
  received?: number
  total?: number
  status?: string
  createdAt?: number
  completedAt?: number
}

export interface Config {
  key: string
  value: string
  type?: string
  updatedAt?: number
}

export interface SelfTabComponent {
  id?: number
  componentId: string
  componentType: string
  positionX?: number
  positionY?: number
  width?: number
  height?: number
  config?: string
  orderIndex?: number
}
