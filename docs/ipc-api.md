# IPC接口规范文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | V1.0 |
| 编写日期 | 2025-12-26 |
| 文档类型 | IPC接口规范 |

---

## 1. IPC通信架构

### 1.1 通信流程

```
渲染进程 (Renderer)          预加载脚本 (Preload)          主进程 (Main)
     │                              │                            │
     │  window.electronAPI.xxx()    │                            │
     ├─────────────────────────────►│                            │
     │                              │  ipcRenderer.invoke()     │
     │                              ├──────────────────────────►│
     │                              │                            │  处理请求
     │                              │                            │
     │                              │  返回结果                  │
     │                              │◄───────────────────────────┤
     │  返回Promise结果             │                            │
     │◄─────────────────────────────┤                            │
```

### 1.2 通信方式

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| invoke | 请求-响应模式 | 需要返回结果的调用 |
| send | 单向发送 | 事件通知 |
| on | 监听事件 | 接收主进程事件 |

---

## 2. 工作区相关接口

### 2.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `workspace:create` | invoke | 创建工作区 |
| `workspace:update` | invoke | 更新工作区 |
| `workspace:delete` | invoke | 删除工作区 |
| `workspace:getAll` | invoke | 获取所有工作区 |
| `workspace:getActive` | invoke | 获取当前激活的工作区 |
| `workspace:setActive` | invoke | 设置激活的工作区 |
| `workspace:export` | invoke | 导出工作区配置 |
| `workspace:import` | invoke | 导入工作区配置 |

### 2.2 接口定义

```typescript
// 创建工作区
workspace:create(data: {
  name: string;
  icon?: string;
  color?: string;
}): Promise<Workspace>

// 更新工作区
workspace:update(id: number, data: {
  name?: string;
  icon?: string;
  color?: string;
  order_index?: number;
}): Promise<boolean>

// 删除工作区
workspace:delete(id: number): Promise<boolean>

// 获取所有工作区
workspace:getAll(): Promise<Workspace[]>

// 获取当前激活的工作区
workspace:getActive(): Promise<Workspace | null>

// 设置激活的工作区
workspace:setActive(id: number): Promise<boolean>

// 导出工作区配置
workspace:export(id: number): Promise<string>

// 导入工作区配置
workspace:import(config: string): Promise<Workspace>
```

---

## 3. 标签相关接口

### 3.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `tab:create` | invoke | 创建标签 |
| `tab:update` | invoke | 更新标签 |
| `tab:delete` | invoke | 删除标签 |
| `tab:getByWorkspace` | invoke | 获取工作区的所有标签 |
| `tab:setActive` | invoke | 设置激活的标签 |
| `tab:pin` | invoke | 固定/取消固定标签 |
| `tab:search` | invoke | 搜索标签 |

### 3.2 接口定义

```typescript
// 创建标签
tab:create(data: {
  url: string;
  title?: string;
  favicon?: string;
  workspace_id: number;
}): Promise<Tab>

// 更新标签
tab:update(id: number, data: {
  url?: string;
  title?: string;
  favicon?: string;
}): Promise<boolean>

// 删除标签
tab:delete(id: number): Promise<boolean>

// 获取工作区的所有标签
tab:getByWorkspace(workspaceId: number): Promise<Tab[]>

// 设置激活的标签
tab:setActive(id: number): Promise<boolean>

// 固定/取消固定标签
tab:pin(id: number, pinned: boolean): Promise<boolean>

// 搜索标签
tab:search(keyword: string): Promise<Tab[]>
```

---

## 4. 书签相关接口

### 4.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `bookmark:create` | invoke | 创建书签 |
| `bookmark:update` | invoke | 更新书签 |
| `bookmark:delete` | invoke | 删除书签 |
| `bookmark:getAll` | invoke | 获取所有书签 |
| `bookmark:getByFolder` | invoke | 获取文件夹的书签 |
| `bookmark:import` | invoke | 导入书签（Chrome格式） |
| `bookmark:export` | invoke | 导出书签（Chrome格式） |
| `bookmark:search` | invoke | 搜索书签 |

### 4.2 接口定义

```typescript
// 创建书签
bookmark:create(data: {
  title: string;
  url: string;
  favicon?: string;
  folder_id?: number;
}): Promise<Bookmark>

// 更新书签
bookmark:update(id: number, data: {
  title?: string;
  url?: string;
  folder_id?: number;
  order_index?: number;
}): Promise<boolean>

// 删除书签
bookmark:delete(id: number): Promise<boolean>

// 获取所有书签
bookmark:getAll(): Promise<Bookmark[]>

// 获取文件夹的书签
bookmark:getByFolder(folderId: number): Promise<Bookmark[]>

// 导入书签（Chrome格式）
bookmark:import(htmlContent: string): Promise<number>

// 导出书签（Chrome格式）
bookmark:export(): Promise<string>

// 搜索书签
bookmark:search(keyword: string): Promise<Bookmark[]>
```

---

## 5. 历史记录相关接口

### 5.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `history:add` | invoke | 添加历史记录 |
| `history:getAll` | invoke | 获取所有历史记录 |
| `history:search` | invoke | 搜索历史记录 |
| `history:clear` | invoke | 清空历史记录 |
| `history:delete` | invoke | 删除历史记录 |

### 5.2 接口定义

```typescript
// 添加历史记录
history:add(data: {
  url: string;
  title?: string;
  favicon?: string;
}): Promise<boolean>

// 获取所有历史记录
history:getAll(options?: {
  limit?: number;
  offset?: number;
}): Promise<History[]>

// 搜索历史记录
history:search(keyword: string): Promise<History[]>

// 清空历史记录
history:clear(): Promise<boolean>

// 删除历史记录
history:delete(id: number): Promise<boolean>
```

---

## 6. 下载相关接口

### 6.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `download:start` | invoke | 开始下载 |
| `download:pause` | invoke | 暂停下载 |
| `download:resume` | invoke | 继续下载 |
| `download:cancel` | invoke | 取消下载 |
| `download:getAll` | invoke | 获取所有下载记录 |
| `download:clear` | invoke | 清空下载记录 |

### 6.2 接口定义

```typescript
// 开始下载
download:start(url: string, options?: {
  filename?: string;
  savePath?: string;
}): Promise<Download>

// 暂停下载
download:pause(id: number): Promise<boolean>

// 继续下载
download:resume(id: number): Promise<boolean>

// 取消下载
download:cancel(id: number): Promise<boolean>

// 获取所有下载记录
download:getAll(): Promise<Download[]>

// 清空下载记录
download:clear(): Promise<boolean>
```

---

## 7. 配置相关接口

### 7.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `config:get` | invoke | 获取配置 |
| `config:set` | invoke | 设置配置 |
| `config:delete` | invoke | 删除配置 |
| `config:getAll` | invoke | 获取所有配置 |
| `config:export` | invoke | 导出配置 |
| `config:import` | invoke | 导入配置 |

### 7.2 接口定义

```typescript
// 获取配置
config:get(key: string): Promise<any>

// 设置配置
config:set(key: string, value: any, type?: string): Promise<boolean>

// 删除配置
config:delete(key: string): Promise<boolean>

// 获取所有配置
config:getAll(): Promise<Record<string, any>>

// 导出配置
config:export(): Promise<string>

// 导入配置
config:import(config: string): Promise<boolean>
```

---

## 8. self-Tab相关接口

### 8.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `selfTab:addComponent` | invoke | 添加组件 |
| `selfTab:updateComponent` | invoke | 更新组件 |
| `selfTab:deleteComponent` | invoke | 删除组件 |
| `selfTab:getAll` | invoke | 获取所有组件 |
| `selfTab:updateLayout` | invoke | 更新布局 |
| `selfTab:export` | invoke | 导出配置 |
| `selfTab:import` | invoke | 导入配置 |

### 8.2 接口定义

```typescript
// 添加组件
selfTab:addComponent(data: {
  component_id: string;
  component_type: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  config?: any;
}): Promise<SelfTabComponent>

// 更新组件
selfTab:updateComponent(id: number, data: {
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  config?: any;
  order_index?: number;
}): Promise<boolean>

// 删除组件
selfTab:deleteComponent(id: number): Promise<boolean>

// 获取所有组件
selfTab:getAll(): Promise<SelfTabComponent[]>

// 更新布局
selfTab:updateLayout(layout: Array<{
  id: number;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
}>): Promise<boolean>

// 导出配置
selfTab:export(): Promise<string>

// 导入配置
selfTab:import(config: string): Promise<boolean>
```

---

## 9. AI相关接口

### 9.1 接口列表

| 接口名 | 类型 | 说明 |
|--------|------|------|
| `ai:search` | invoke | 智能搜索 |
| `ai:summarize` | invoke | 智能摘要 |
| `ai:translate` | invoke | AI翻译 |
| `ai:explain` | invoke | AI解释 |
| `ai:recommend` | invoke | AI推荐 |

### 9.2 接口定义

```typescript
// 智能搜索
ai:search(query: string): Promise<{
  answer: string;
  sources?: string[];
}>

// 智能摘要
ai:summarize(content: string, options?: {
  maxLength?: number;
}): Promise<string>

// AI翻译
ai:translate(text: string, targetLang: string): Promise<string>

// AI解释
ai:explain(text: string): Promise<string>

// AI推荐
ai:recommend(context: {
  history?: string[];
  currentUrl?: string;
}): Promise<Array<{
  title: string;
  url: string;
  description: string;
}>>
```

---

## 10. 数据类型定义

### 10.1 工作区

```typescript
interface Workspace {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  created_at: number;
  updated_at: number;
  is_active: number;
  order_index: number;
}
```

### 10.2 标签

```typescript
interface Tab {
  id: number;
  url: string;
  title?: string;
  favicon?: string;
  workspace_id: number;
  created_at: number;
  updated_at: number;
  is_pinned: number;
  is_active: number;
}
```

### 10.3 书签

```typescript
interface Bookmark {
  id: number;
  title: string;
  url: string;
  favicon?: string;
  folder_id?: number;
  created_at: number;
  updated_at: number;
  order_index: number;
}
```

### 10.4 文件夹

```typescript
interface Folder {
  id: number;
  name: string;
  parent_id?: number;
  created_at: number;
  updated_at: number;
  order_index: number;
}
```

### 10.5 历史记录

```typescript
interface History {
  id: number;
  url: string;
  title?: string;
  favicon?: string;
  visit_count: number;
  last_visit: number;
  created_at: number;
}
```

### 10.6 下载

```typescript
interface Download {
  id: number;
  url: string;
  filename: string;
  save_path: string;
  file_size?: number;
  received: number;
  total?: number;
  status: string;
  created_at: number;
  completed_at?: number;
}
```

### 10.7 self-Tab组件

```typescript
interface SelfTabComponent {
  id: number;
  component_id: string;
  component_type: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  config?: any;
  order_index: number;
}
```

---

## 11. 错误处理

### 11.1 错误格式

```typescript
interface IPCError {
  code: string;
  message: string;
  details?: any;
}
```

### 11.2 常见错误码

| 错误码 | 说明 |
|--------|------|
| `INVALID_PARAMS` | 参数无效 |
| `NOT_FOUND` | 资源不存在 |
| `PERMISSION_DENIED` | 权限不足 |
| `DATABASE_ERROR` | 数据库错误 |
| `NETWORK_ERROR` | 网络错误 |
| `UNKNOWN_ERROR` | 未知错误 |

### 11.3 错误处理示例

```typescript
try {
  const workspace = await window.electronAPI.workspace.create({
    name: '工作区1'
  });
} catch (error) {
  console.error('创建工作区失败:', error.message);
}
```

---

## 12. 安全规范

### 12.1 参数验证

- 所有输入参数必须验证
- 防止SQL注入
- 防止XSS攻击

### 12.2 权限控制

- 敏感操作需要权限验证
- 文件访问需要路径检查
- 网络请求需要白名单控制

### 12.3 数据加密

- 敏感数据传输加密
- 本地存储数据加密
- 密钥安全管理

---

## 13. 性能优化

### 13.1 批量操作

- 支持批量创建、更新、删除
- 减少IPC通信次数
- 使用事务处理

### 13.2 缓存策略

- 频繁访问数据缓存
- 设置合理的缓存过期时间
- 提供缓存刷新接口

### 13.3 数据分页

- 大数据量查询支持分页
- 默认限制返回数量
- 支持自定义分页大小

---

## 14. 版本管理

### 14.1 API版本

- 所有接口包含版本号
- 向后兼容原则
- 废弃接口提前通知

### 14.2 接口命名规范

- 格式: `模块名:操作名`
- 使用小写字母和下划线
- 动词使用祈使句
