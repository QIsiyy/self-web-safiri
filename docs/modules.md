# 模块设计文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | V1.0 |
| 编写日期 | 2025-12-26 |
| 文档类型 | 模块设计 |

---

## 1. 模块架构

```
self-web-safiri
├── 核心模块 (Core)
│   ├── 浏览模块 (Browser)
│   ├── 标签模块 (Tabs)
│   └── 窗口模块 (Window)
├── 个性化模块 (Personalization)
│   ├── 工作区模块 (Workspace)
│   ├── self-Tab模块 (SelfTab)
│   └── 样式模块 (Theme)
├── 数据管理模块 (Data)
│   ├── 书签模块 (Bookmarks)
│   ├── 历史模块 (History)
│   └── 下载模块 (Downloads)
├── 阅读模块 (Reader)
├── AI模块 (AI)
├── 插件模块 (Plugins)
└── 系统模块 (System)
```

---

## 2. 核心模块

### 2.1 浏览模块 (Browser)

**职责**: 提供基础的网页浏览功能

**主要功能**:
- 网页加载和渲染
- 地址栏输入和智能联想
- 页面导航（前进、后退、刷新、停止）
- 二维码生成和识别

**技术依赖**:
- Chromium内核
- Vue Router
- qrcode
- jsQR

**核心接口**:
- `loadUrl(url: string)`: 加载网页
- `goBack()`: 后退
- `goForward()`: 前进
- `reload()`: 刷新
- `stop()`: 停止加载
- `generateQRCode(url: string)`: 生成二维码
- `scanQRCode()`: 扫描二维码

---

### 2.2 标签模块 (Tabs)

**职责**: 管理浏览器标签页

**主要功能**:
- 标签创建、关闭、固定
- 标签拖拽排序
- 标签搜索和筛选
- 标签个性化（图标、颜色、宽度）

**技术依赖**:
- Vue 3
- Pinia
- Sortable.js

**核心接口**:
- `createTab(url: string, workspaceId: number)`: 创建标签
- `closeTab(id: number)`: 关闭标签
- `pinTab(id: number, pinned: boolean)`: 固定标签
- `switchTab(id: number)`: 切换标签
- `searchTabs(keyword: string)`: 搜索标签

---

### 2.3 窗口模块 (Window)

**职责**: 管理浏览器窗口

**主要功能**:
- 窗口创建、关闭、最小化、最大化
- 窗口布局管理
- 多窗口支持

**技术依赖**:
- Electron BrowserWindow

**核心接口**:
- `createWindow(options: WindowOptions)`: 创建窗口
- `closeWindow(id: number)`: 关闭窗口
- `minimizeWindow(id: number)`: 最小化窗口
- `maximizeWindow(id: number)`: 最大化窗口
- `restoreWindow(id: number)`: 恢复窗口

---

## 3. 个性化模块

### 3.1 工作区模块 (Workspace)

**职责**: 管理用户工作区

**主要功能**:
- 工作区创建、删除、重命名
- 工作区切换
- 工作区保存和恢复
- 工作区导出和导入

**技术依赖**:
- SQLite
- Pinia

**核心接口**:
- `createWorkspace(name: string, icon?: string, color?: string)`: 创建工作区
- `deleteWorkspace(id: number)`: 删除工作区
- `updateWorkspace(id: number, data: WorkspaceData)`: 更新工作区
- `switchWorkspace(id: number)`: 切换工作区
- `exportWorkspace(id: number)`: 导出工作区
- `importWorkspace(config: string)`: 导入工作区

---

### 3.2 self-Tab模块 (SelfTab)

**职责**: 管理自定义新标签页

**主要功能**:
- 组件添加、删除、排序
- 布局自定义（网格、列表）
- 样式自定义（背景、字体、颜色）
- 配置导出和导入

**技术依赖**:
- Vue 3
- SQLite
- Gridstack.js

**核心接口**:
- `addComponent(component: SelfTabComponent)`: 添加组件
- `removeComponent(id: number)`: 删除组件
- `updateComponent(id: number, data: ComponentData)`: 更新组件
- `updateLayout(layout: Layout[])`: 更新布局
- `exportConfig()`: 导出配置
- `importConfig(config: string)`: 导入配置

**可用组件**:
- 天气组件 (weather)
- 待办事项组件 (todo)
- 日历组件 (calendar)
- 搜索组件 (search)
- 快捷方式组件 (shortcuts)
- 时钟组件 (clock)

---

### 3.3 样式模块 (Theme)

**职责**: 管理应用主题和样式

**主要功能**:
- 主题切换（亮色、暗色）
- 自定义样式
- 样式导入导出

**技术依赖**:
- Tailwind CSS
- Pinia

**核心接口**:
- `setTheme(theme: 'light' | 'dark' | 'auto')`: 设置主题
- `getTheme()`: 获取当前主题
- `setCustomStyle(style: CustomStyle)`: 设置自定义样式
- `exportStyle()`: 导出样式
- `importStyle(config: string)`: 导入样式

---

## 4. 数据管理模块

### 4.1 书签模块 (Bookmarks)

**职责**: 管理用户书签

**主要功能**:
- 书签添加、删除、编辑
- 书签分类和文件夹
- 书签导入导出（Chrome格式）
- 书签搜索

**技术依赖**:
- SQLite
- Vue 3

**核心接口**:
- `addBookmark(data: BookmarkData)`: 添加书签
- `removeBookmark(id: number)`: 删除书签
- `updateBookmark(id: number, data: BookmarkData)`: 更新书签
- `searchBookmarks(keyword: string)`: 搜索书签
- `importBookmarks(htmlContent: string)`: 导入书签
- `exportBookmarks()`: 导出书签

---

### 4.2 历史模块 (History)

**职责**: 管理浏览历史

**主要功能**:
- 历史记录保存
- 历史搜索和筛选
- 历史清理

**技术依赖**:
- SQLite
- Vue 3

**核心接口**:
- `addHistory(data: HistoryData)`: 添加历史记录
- `getHistory(options?: HistoryOptions)`: 获取历史记录
- `searchHistory(keyword: string)`: 搜索历史
- `clearHistory()`: 清空历史
- `deleteHistory(id: number)`: 删除历史记录

---

### 4.3 下载模块 (Downloads)

**职责**: 管理文件下载

**主要功能**:
- 下载任务管理
- 下载进度显示
- 下载历史
- 下载路径管理

**技术依赖**:
- Electron DownloadItem
- SQLite

**核心接口**:
- `startDownload(url: string, options?: DownloadOptions)`: 开始下载
- `pauseDownload(id: number)`: 暂停下载
- `resumeDownload(id: number)`: 继续下载
- `cancelDownload(id: number)`: 取消下载
- `getDownloads()`: 获取下载记录
- `clearDownloads()`: 清空下载记录

---

## 5. 阅读模块

### 5.1 阅读模块 (Reader)

**职责**: 提供沉浸式阅读体验

**主要功能**:
- 网页内容提取
- 阅读器UI渲染
- 阅读样式自定义
- 阅读进度保存
- 文字高亮、批注
- 朗读功能

**技术依赖**:
- Vue 3
- Readability库
- SQLite
- Web Speech API

**核心接口**:
- `extractContent(url: string)`: 提取网页内容
- `renderReader(content: ReaderContent)`: 渲染阅读器
- `setReaderStyle(style: ReaderStyle)`: 设置阅读样式
- `saveProgress(progress: ReaderProgress)`: 保存阅读进度
- `highlightText(text: string, color: string)`: 高亮文字
- `addAnnotation(annotation: Annotation)`: 添加批注
- `speakText(text: string)`: 朗读文字
- `stopSpeaking()`: 停止朗读

---

## 6. AI模块

### 6.1 AI模块 (AI)

**职责**: 提供AI辅助功能

**主要功能**:
- 智能搜索（直接生成答案）
- 智能摘要（文章摘要生成）
- AI翻译（多语言翻译）
- AI解释（选中文字解释）
- AI推荐（内容推荐）

**技术依赖**:
- OpenAI API / 阿里云通义千问

**核心接口**:
- `smartSearch(query: string)`: 智能搜索
- `summarize(content: string)`: 智能摘要
- `translate(text: string, targetLang: string)`: AI翻译
- `explain(text: string)`: AI解释
- `recommend(context: string)`: AI推荐

---

## 7. 插件模块

### 7.1 插件模块 (Plugins)

**职责**: 管理浏览器插件

**主要功能**:
- 插件安装、卸载、启用、禁用
- 插件权限管理
- 插件API提供
- Chrome扩展兼容

**技术依赖**:
- Electron Extension API

**核心接口**:
- `installPlugin(path: string)`: 安装插件
- `uninstallPlugin(id: string)`: 卸载插件
- `enablePlugin(id: string)`: 启用插件
- `disablePlugin(id: string)`: 禁用插件
- `getPlugins()`: 获取插件列表
- `checkPermission(pluginId: string, permission: string)`: 检查权限

---

## 8. 系统模块

### 8.1 配置管理 (Config)

**职责**: 管理应用配置

**主要功能**:
- 配置读取和保存
- 配置导入导出
- 默认配置管理

**技术依赖**:
- SQLite

**核心接口**:
- `getConfig(key: string)`: 获取配置
- `setConfig(key: string, value: any)`: 设置配置
- `deleteConfig(key: string)`: 删除配置
- `exportConfig()`: 导出配置
- `importConfig(config: string)`: 导入配置

---

### 8.2 数据库管理 (Database)

**职责**: 管理SQLite数据库

**主要功能**:
- 数据库初始化
- 数据库连接管理
- 数据库迁移
- 数据加密

**技术依赖**:
- better-sqlite3
- crypto-js

**核心接口**:
- `initDatabase()`: 初始化数据库
- `closeDatabase()`: 关闭数据库
- `executeQuery(sql: string, params?: any[])`: 执行查询
- `migrate(version: number)`: 数据库迁移
- `encryptData(data: string)`: 加密数据
- `decryptData(encrypted: string)`: 解密数据

---

### 8.3 安全管理 (Security)

**职责**: 管理应用安全

**主要功能**:
- 恶意网站检测
- 下载文件校验
- 数据加密
- 隐私保护

**技术依赖**:
- Google Safe Browsing API
- crypto-js

**核心接口**:
- `checkUrlSafety(url: string)`: 检查URL安全性
- `verifyFile(filePath: string)`: 验证文件
- `encryptData(data: string)`: 加密数据
- `decryptData(encrypted: string)`: 解密数据

---

### 8.4 更新管理 (Update)

**职责**: 管理应用更新

**主要功能**:
- 检查更新
- 下载更新
- 安装更新

**技术依赖**:
- Electron AutoUpdater

**核心接口**:
- `checkForUpdates()`: 检查更新
- `downloadUpdate()`: 下载更新
- `installUpdate()`: 安装更新
- `setAutoUpdate(enabled: boolean)`: 设置自动更新

---

## 9. 模块依赖关系

```
系统模块 (System)
    ├── 配置管理
    ├── 数据库管理
    ├── 安全管理
    └── 更新管理
         ↓
核心模块 (Core)
    ├── 浏览模块
    ├── 标签模块
    └── 窗口模块
         ↓
个性化模块 (Personalization)
    ├── 工作区模块
    ├── self-Tab模块
    └── 样式模块
         ↓
数据管理模块 (Data)
    ├── 书签模块
    ├── 历史模块
    └── 下载模块
         ↓
功能模块
    ├── 阅读模块
    ├── AI模块
    └── 插件模块
```

---

## 10. 开发规范

### 10.1 模块命名

- 使用大驼峰命名法
- 模块名使用英文
- 避免使用缩写

### 10.2 接口设计

- 使用TypeScript类型定义
- 统一返回格式
- 错误处理规范

### 10.3 代码组织

- 每个模块独立目录
- 按功能划分子模块
- 统一导出方式
