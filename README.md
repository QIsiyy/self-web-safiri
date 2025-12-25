# Self Web Safiri

一个基于 Electron + Vue 3 的个性化浏览器应用，支持工作区管理、标签页组织和自定义组件。

## 功能特性

- 工作区管理 - 创建和管理多个工作空间
- 标签页管理 - 灵活的标签页组织和切换
- 自定义组件 - 可拖拽的自定义标签组件
- 书签系统 - 完整的书签管理功能
- 历史记录 - 浏览历史追踪
- 下载管理 - 文件下载管理

## 技术栈

- **框架**: Electron 29 + Vue 3 + TypeScript
- **构建工具**: Vite 5
- **UI 框架**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **数据库**: SQLite
- **代码规范**: ESLint + Prettier

## 项目结构

```
self-web-safiri/
├── src/
│   ├── main/          # Electron 主进程
│   │   ├── database/  # 数据库管理
│   │   └── ipc/       # IPC 通信处理
│   ├── renderer/      # 渲染进程（Vue 应用）
│   │   ├── assets/    # 静态资源
│   │   ├── router/    # 路由配置
│   │   ├── store/     # 状态管理
│   │   ├── views/     # 页面组件
│   │   └── types/     # TypeScript 类型定义
│   ├── preload/       # 预加载脚本
│   └── shared/        # 共享代码
├── docs/              # 项目文档
└── build/             # 构建配置
```

## 开发环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 安装依赖

```bash
npm install
```

## 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动，Electron 窗口会自动打开。

## 构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 代码规范

```bash
npm run lint
npm run format
```

## 测试

```bash
npm run test
```

## 文档

详细的技术文档请查看 [docs](./docs) 目录：

- [架构设计](./docs/architecture.md)
- [模块设计](./docs/modules.md)
- [数据库设计](./docs/database.md)
- [IPC 接口](./docs/ipc-api.md)
- [需求文档](./docs/requirements.md)
- [开发计划](./docs/development-plan.md)

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
