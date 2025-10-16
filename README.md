# NotSeek 论坛 - 现代化技术社区

一个基于 Next.js 14 构建的现代化论坛系统，灵感来源于 NotSeek 社区，提供简洁优雅的用户体验和完整的论坛功能。

![首页](https://res.cloudinary.com/nodeseek/image/upload/v1760576495/iwjlfbgrffbw9dob2wcn.webp)

## 🚀 项目特性

### 核心功能

- **用户认证系统** - 完整的登录/注册功能，支持用户个人资料管理
- **帖子管理** - 发布、编辑、删除帖子，支持草稿保存
- **分类系统** - 多个话题分类（日常、技术、信息、测评、交易、拼车、推广）
- **评论系统** - 支持多级评论和回复
- **搜索功能** - 全文搜索帖子标题、内容和作者
- **响应式设计** - 完美适配桌面端和移动端
- **实时数据** - 基于 React Context 的状态管理

### 用户体验

- **现代化 UI** - 基于 shadcn/ui 组件库，使用 Tailwind CSS v4
- **深色模式支持** - 自动适配系统主题偏好
- **快捷功能区** - 签到、管理记录、幸运抽奖等便民功能
- **用户等级系统** - 基于活跃度的用户等级展示
- **智能导航** - 根据用户来源智能显示返回按钮

## 🏗️ 技术架构

### 前端技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4 + shadcn/ui
- **状态管理**: React Context API
- **图标**: Lucide React
- **表单**: React Hook Form + Zod 验证
- **动画**: Tailwind CSS 动画 + tw-animate-css

### 核心依赖

\`\`\`json
{
"next": "14.2.25",
"react": "^19",
"typescript": "^5",
"tailwindcss": "^4.1.9",
"lucide-react": "^0.454.0",
"react-hook-form": "^7.60.0",
"zod": "3.25.67"
}
\`\`\`

## 📁 项目结构

\`\`\`
├── app/ # Next.js App Router 页面
│ ├── categories/ # 分类页面
│ ├── dashboard/ # 用户仪表板
│ ├── new-post/ # 发布新帖
│ ├── post/[id]/ # 帖子详情页
│ ├── search/ # 搜索页面
│ ├── settings/ # 用户设置
│ ├── t/[slug]/ # 分类详情页
│ ├── user/[id]/ # 用户个人页
│ ├── layout.tsx # 根布局
│ ├── page.tsx # 首页
│ └── globals.css # 全局样式
├── components/ # React 组件
│ ├── auth/ # 认证相关组件
│ ├── ui/ # shadcn/ui 基础组件
│ ├── forum-header.tsx # 论坛头部
│ ├── forum-sidebar.tsx # 侧边栏
│ ├── post-card.tsx # 帖子卡片
│ ├── comment-item.tsx # 评论组件
│ └── icons.tsx # 图标组件
├── lib/ # 工具库和状态管理
│ ├── auth.tsx # 认证状态管理
│ ├── posts.tsx # 帖子状态管理
│ ├── comments.tsx # 评论状态管理
│ ├── categories.tsx # 分类状态管理
│ └── utils.ts # 工具函数
├── hooks/ # 自定义 Hooks
├── public/ # 静态资源
└── styles/ # 样式文件
\`\`\`

## 🎨 设计系统

### 色彩方案

项目采用专业的色彩系统，支持明暗两种主题：

**明亮主题**

- 主色调：`oklch(0.47 0.13 258.338)` - 专业蓝色
- 背景色：`oklch(0.99 0.005 106.423)` - 纯净白色
- 文字色：`oklch(0.15 0.01 258.338)` - 深灰色

**深色主题**

- 主色调：`oklch(0.6 0.15 258.338)` - 亮蓝色
- 背景色：`oklch(0.08 0.01 258.338)` - 深色背景
- 文字色：`oklch(0.95 0.005 106.423)` - 浅色文字

### 组件设计原则

- **一致性** - 统一的间距、圆角、阴影系统
- **可访问性** - 符合 WCAG 标准的对比度和键盘导航
- **响应式** - Mobile-first 设计理念
- **性能优化** - 组件懒加载和代码分割

## 💾 数据管理

### 状态管理架构

项目使用 React Context API 进行状态管理，主要包含以下几个 Context：

1. **AuthProvider** - 用户认证状态
2. **PostsProvider** - 帖子数据管理
3. **CommentsProvider** - 评论数据管理
4. **CategoriesProvider** - 分类数据管理

### 数据持久化

- **本地存储** - 使用 localStorage 持久化用户状态和帖子数据
- **模拟数据** - 当前使用模拟数据，便于开发和演示
- **数据结构** - 完整的 TypeScript 类型定义

### 数据模型

\`\`\`typescript
// 用户模型
interface User {
id: string
email: string
username: string
avatarUrl?: string
bio?: string
createdAt: string
drumsticks?: number
}

// 帖子模型
interface Post {
id: string
title: string
content: string
topic: string
author: {
id: string
name: string
avatar: string
}
replyCount: number
viewCount: number
createdAt: string
updatedAt: string
isSticky?: boolean
isDraft?: boolean
}
\`\`\`

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- pnpm 8.0 或更高版本（推荐）

### 安装步骤

1. **克隆项目**
   \`\`\`bash
   git clone <repository-url>
   cd NotSeek-forum
   \`\`\`

2. **安装依赖**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **启动开发服务器**
   \`\`\`bash
   pnpm dev
   \`\`\`

4. **访问应用**
   打开浏览器访问 `http://localhost:3000`

### 开发命令

\`\`\`bash

# 开发模式

pnpm dev

# 构建生产版本

pnpm build

# 启动生产服务器

pnpm start

# 代码检查

pnpm lint
\`\`\`

## 📦 部署指南

### Vercel 部署（推荐）

1. **连接 GitHub**

   - 将代码推送到 GitHub 仓库
   - 在 Vercel 控制台导入项目

2. **配置构建**

   - 框架预设：Next.js
   - 构建命令：`pnpm build`
   - 输出目录：`.next`

3. **环境变量**
   - 当前项目无需额外环境变量
   - 如需集成数据库，请添加相应的连接字符串

### 其他部署平台

**Netlify**
\`\`\`bash

# 构建命令

pnpm build

# 发布目录

out
\`\`\`

**Docker 部署**
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package\*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
\`\`\`

## 🔧 配置说明

### Next.js 配置

\`\`\`javascript
// next.config.mjs
/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
experimental: {
optimizePackageImports: ['lucide-react']
}
}
\`\`\`

### Tailwind CSS 配置

项目使用 Tailwind CSS v4，配置文件位于 `app/globals.css`：

- 自定义颜色系统
- 响应式断点
- 动画效果
- 深色模式支持

### TypeScript 配置

严格的 TypeScript 配置，确保代码质量：

- 严格模式启用
- 路径别名配置（`@/` 指向根目录）
- 完整的类型检查

## 🎯 功能特性详解

### 用户认证系统

- **登录/注册** - 表单验证和错误处理
- **会话管理** - 基于 localStorage 的会话持久化
- **用户资料** - 头像、个人简介、等级系统
- **权限控制** - 基于用户状态的功能访问控制

### 帖子管理系统

- **富文本编辑** - 支持 Markdown 格式
- **分类管理** - 7 个主要分类，支持扩展
- **草稿功能** - 自动保存和手动保存
- **搜索功能** - 全文搜索，支持标题、内容、作者搜索
- **排序功能** - 按时间、热度、置顶状态排序

### 评论系统

- **多级回复** - 支持无限层级的评论回复
- **实时更新** - 评论数量实时同步
- **用户互动** - @提及、点赞等功能预留接口

### 响应式设计

- **移动端优化** - 完美适配各种屏幕尺寸
- **触摸友好** - 优化的触摸交互体验
- **性能优化** - 图片懒加载、组件按需加载

## 🔮 未来规划

### 短期目标

- [ ] 集成真实数据库（Supabase/PostgreSQL）
- [ ] 添加文件上传功能
- [ ] 实现消息通知系统
- [ ] 添加用户关注功能

### 中期目标

- [ ] 集成第三方登录（GitHub、Google）
- [ ] 添加管理员后台
- [ ] 实现内容审核系统
- [ ] 添加移动端 PWA 支持

### 长期目标

- [ ] 实时聊天功能
- [ ] AI 内容推荐
- [ ] 多语言支持
- [ ] 插件系统

## 🤝 贡献指南

### 开发流程

1. Fork 项目到个人仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名
- 提交信息使用约定式提交格式

### 测试要求

- 新功能需要添加相应测试
- 确保所有测试通过
- 保持测试覆盖率在 80% 以上

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 高质量的 React 组件库
- [Lucide](https://lucide.dev/) - 美观的开源图标库
- [Vercel](https://vercel.com/) - 部署和托管平台

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 创建 [Issue](../../issues)
- 发起 [Discussion](../../discussions)
- 邮件联系：[your-email@example.com]

---

**NotSeek 论坛** - 让技术交流更简单 🚀
