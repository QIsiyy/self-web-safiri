# 数据库设计文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | V1.0 |
| 编写日期 | 2025-12-26 |
| 文档类型 | 数据库设计 |

---

## 1. 数据库概述

### 1.1 数据库选型

| 数据库 | 版本 | 用途 |
|--------|------|------|
| SQLite | 3.x | 主数据库，存储持久化数据 |
| IndexedDB | 原生 | 浏览器缓存，存储临时数据 |

### 1.2 数据库特性

- 轻量级，无需独立服务
- 支持事务
- 支持加密
- 跨平台兼容

---

## 2. ER图

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   workspaces │       │    tabs      │       │   bookmarks  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ id (PK)      │       │ id (PK)      │
│ name         │       │ url          │       │ title        │
│ icon         │       │ title        │       │ url          │
│ color        │       │ favicon      │       │ favicon      │
│ created_at   │       │ workspace_id │───────►│ folder_id    │
│ updated_at   │       │ created_at   │       │ created_at   │
│ is_active    │       │ updated_at   │       │ updated_at   │
│ order_index  │       │ is_pinned    │       │ order_index  │
└──────────────┘       │ is_active    │       └──────────────┘
                       └──────────────┘                │
                                                        │
┌──────────────┐       ┌──────────────┐                │
│   history    │       │   folders    │◄───────────────┘
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ url          │       │ name         │
│ title        │       │ parent_id    │
│ favicon      │       │ created_at   │
│ visit_count  │       │ updated_at   │
│ last_visit   │       │ order_index  │
│ created_at   │       └──────────────┘
└──────────────┘
       │
       │
┌──────────────┐       ┌──────────────┐
│   downloads  │       │   configs    │
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ key (PK)     │
│ url          │       │ value        │
│ filename     │       │ type         │
│ save_path    │       │ updated_at   │
│ file_size    │       └──────────────┘
│ received     │
│ total        │       ┌──────────────┐
│ status       │       │ self_tab     │
│ created_at   │       ├──────────────┤
│ completed_at │       │ id (PK)      │
└──────────────┘       │ component_id │
                       │ component_type│
                       │ position_x   │
                       │ position_y   │
                       │ width        │
                       │ height       │
                       │ config       │
                       │ order_index  │
                       └──────────────┘
```

---

## 3. 表结构设计

### 3.1 workspaces（工作区表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 工作区ID |
| name | TEXT | NOT NULL | 工作区名称 |
| icon | TEXT | | 工作区图标（emoji或图标名称） |
| color | TEXT | | 工作区颜色（十六进制） |
| created_at | INTEGER | NOT NULL | 创建时间（时间戳） |
| updated_at | INTEGER | NOT NULL | 更新时间（时间戳） |
| is_active | INTEGER | DEFAULT 0 | 是否激活（0:否, 1:是） |
| order_index | INTEGER | DEFAULT 0 | 排序索引 |

**索引**:
- PRIMARY KEY: id
- INDEX: is_active, order_index

---

### 3.2 tabs（标签表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 标签ID |
| url | TEXT | NOT NULL | 网页URL |
| title | TEXT | | 网页标题 |
| favicon | TEXT | | 网页图标URL |
| workspace_id | INTEGER | FOREIGN KEY | 所属工作区ID |
| created_at | INTEGER | NOT NULL | 创建时间（时间戳） |
| updated_at | INTEGER | NOT NULL | 更新时间（时间戳） |
| is_pinned | INTEGER | DEFAULT 0 | 是否固定（0:否, 1:是） |
| is_active | INTEGER | DEFAULT 1 | 是否激活（0:否, 1:是） |

**索引**:
- PRIMARY KEY: id
- INDEX: workspace_id, is_active, is_pinned
- FOREIGN KEY: workspace_id → workspaces(id)

---

### 3.3 bookmarks（书签表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 书签ID |
| title | TEXT | NOT NULL | 书签标题 |
| url | TEXT | NOT NULL | 网页URL |
| favicon | TEXT | | 网页图标URL |
| folder_id | INTEGER | FOREIGN KEY | 所属文件夹ID |
| created_at | INTEGER | NOT NULL | 创建时间（时间戳） |
| updated_at | INTEGER | NOT NULL | 更新时间（时间戳） |
| order_index | INTEGER | DEFAULT 0 | 排序索引 |

**索引**:
- PRIMARY KEY: id
- INDEX: folder_id, order_index
- FOREIGN KEY: folder_id → folders(id)

---

### 3.4 folders（文件夹表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 文件夹ID |
| name | TEXT | NOT NULL | 文件夹名称 |
| parent_id | INTEGER | FOREIGN KEY | 父文件夹ID（NULL表示根目录） |
| created_at | INTEGER | NOT NULL | 创建时间（时间戳） |
| updated_at | INTEGER | NOT NULL | 更新时间（时间戳） |
| order_index | INTEGER | DEFAULT 0 | 排序索引 |

**索引**:
- PRIMARY KEY: id
- INDEX: parent_id, order_index
- FOREIGN KEY: parent_id → folders(id)

---

### 3.5 history（历史记录表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 历史记录ID |
| url | TEXT | NOT NULL | 网页URL |
| title | TEXT | | 网页标题 |
| favicon | TEXT | | 网页图标URL |
| visit_count | INTEGER | DEFAULT 1 | 访问次数 |
| last_visit | INTEGER | NOT NULL | 最后访问时间（时间戳） |
| created_at | INTEGER | NOT NULL | 创建时间（时间戳） |

**索引**:
- PRIMARY KEY: id
- INDEX: url, last_visit

---

### 3.6 downloads（下载记录表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 下载记录ID |
| url | TEXT | NOT NULL | 下载URL |
| filename | TEXT | NOT NULL | 文件名 |
| save_path | TEXT | NOT NULL | 保存路径 |
| file_size | INTEGER | | 文件大小（字节） |
| received | INTEGER | DEFAULT 0 | 已下载字节数 |
| total | INTEGER | | 总字节数 |
| status | TEXT | NOT NULL | 下载状态（pending/downloading/completed/failed/cancelled） |
| created_at | INTEGER | NOT NULL | 创建时间（时间戳） |
| completed_at | INTEGER | | 完成时间（时间戳） |

**索引**:
- PRIMARY KEY: id
- INDEX: status, created_at

---

### 3.7 configs（配置表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| key | TEXT | PRIMARY KEY | 配置键 |
| value | TEXT | NOT NULL | 配置值（JSON字符串） |
| type | TEXT | NOT NULL | 配置类型（string/number/boolean/object） |
| updated_at | INTEGER | NOT NULL | 更新时间（时间戳） |

**索引**:
- PRIMARY KEY: key

**常用配置键**:
- `search_engine`: 默认搜索引擎
- `theme`: 主题（light/dark）
- `homepage`: 主页URL
- `download_path`: 默认下载路径
- `self_tab_layout`: self-Tab布局（grid/list）
- `reader_font`: 阅读器字体
- `reader_font_size`: 阅读器字号
- `reader_background`: 阅读器背景色

---

### 3.8 self_tab（self-Tab配置表）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 组件ID |
| component_id | TEXT | NOT NULL | 组件ID（weather/todo/calendar等） |
| component_type | TEXT | NOT NULL | 组件类型 |
| position_x | INTEGER | NOT NULL | X坐标 |
| position_y | INTEGER | NOT NULL | Y坐标 |
| width | INTEGER | NOT NULL | 宽度 |
| height | INTEGER | NOT NULL | 高度 |
| config | TEXT | | 组件配置（JSON字符串） |
| order_index | INTEGER | DEFAULT 0 | 排序索引 |

**索引**:
- PRIMARY KEY: id
- INDEX: component_id, order_index

---

## 4. 数据库初始化脚本

```sql
-- 创建工作区表
CREATE TABLE IF NOT EXISTS workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    is_active INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tabs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    favicon TEXT,
    workspace_id INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    is_pinned INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- 创建文件夹表
CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- 创建书签表
CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    favicon TEXT,
    folder_id INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- 创建历史记录表
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    favicon TEXT,
    visit_count INTEGER DEFAULT 1,
    last_visit INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

-- 创建下载记录表
CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    save_path TEXT NOT NULL,
    file_size INTEGER,
    received INTEGER DEFAULT 0,
    total INTEGER,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    completed_at INTEGER
);

-- 创建配置表
CREATE TABLE IF NOT EXISTS configs (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 创建self-Tab配置表
CREATE TABLE IF NOT EXISTS self_tab (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    component_id TEXT NOT NULL,
    component_type TEXT NOT NULL,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    config TEXT,
    order_index INTEGER DEFAULT 0
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tabs_workspace ON tabs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tabs_active ON tabs(is_active);
CREATE INDEX IF NOT EXISTS idx_bookmarks_folder ON bookmarks(folder_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_history_url ON history(url);
CREATE INDEX IF NOT EXISTS idx_history_last_visit ON history(last_visit);
CREATE INDEX IF NOT EXISTS idx_downloads_status ON downloads(status);
CREATE INDEX IF NOT EXISTS idx_self_tab_component ON self_tab(component_id);
```

---

## 5. 数据库操作规范

### 5.1 连接管理

- 使用单例模式管理数据库连接
- 应用启动时初始化连接
- 应用退出时关闭连接

### 5.2 事务处理

- 写操作使用事务
- 事务失败时回滚
- 避免长时间事务

### 5.3 错误处理

- 捕获所有数据库错误
- 记录错误日志
- 友好错误提示

### 5.4 性能优化

- 合理使用索引
- 避免全表扫描
- 定期清理历史数据
- 使用预编译语句

---

## 6. 数据迁移

### 6.1 迁移策略

- 版本号管理
- 增量迁移
- 回滚支持

### 6.2 迁移脚本

```sql
-- 示例：添加新字段
ALTER TABLE workspaces ADD COLUMN description TEXT;

-- 示例：创建新表
CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    settings TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

---

## 7. 数据备份与恢复

### 7.1 备份策略

- 定期自动备份
- 手动备份支持
- 备份文件加密

### 7.2 备份命令

```bash
# 备份数据库
sqlite3 database.db ".backup backup.db"

# 恢复数据库
sqlite3 database.db ".restore backup.db"
```

---

## 8. 数据安全

### 8.1 加密策略

- 敏感字段加密
- 使用AES加密
- 密钥安全管理

### 8.2 访问控制

- 读写权限分离
- SQL注入防护
- 参数化查询

---

## 9. 数据清理策略

### 9.1 历史记录清理

- 保留最近90天
- 超过1000条自动清理
- 支持手动清理

### 9.2 下载记录清理

- 保留最近30天
- 已完成记录自动清理
- 支持手动清理

### 9.3 缓存清理

- 定期清理过期缓存
- 限制缓存大小
- LRU淘汰策略
