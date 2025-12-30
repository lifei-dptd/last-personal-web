# 刘力菲的个人网站 - Vercel 优化版

这是一个为 Vercel 部署优化的动态个人网站。

## 项目结构

```
个人网站/
├── api/                  # Vercel API 函数目录
│   └── index.js         # Express 服务器（Vercel 入口）
├── index.html           # 首页
├── login.html           # 登录页
├── guestbook.html       # 留言板
├── admin.html           # 管理页面
├── style.css            # 样式文件
├── script.js            # 前端脚本
├── server.js            # 本地开发服务器
├── package.json         # 项目依赖
├── vercel.json         # Vercel 配置
├── visitors.json        # 访客数据
├── guestbook.json       # 留言数据
├── stats.json          # 统计数据
└── README.md           # 项目说明
```

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动本地服务器

```bash
node server.js
```

或运行：

```bash
npm start
```

访问 http://localhost:3000

## 部署到 Vercel

### 方法一：使用 Vercel CLI（推荐）

1. 安装 Vercel CLI：

```bash
npm install -g vercel
```

2. 在项目目录执行：

```bash
vercel --prod
```

3. 按照提示操作即可完成部署

### 方法二：通过 GitHub 部署

1. 将代码推送到 GitHub 仓库

2. 在 Vercel 导入仓库

3. Vercel 会自动检测并部署

## Vercel 配置说明

### vercel.json

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

这个配置将所有请求重定向到 `/api` 目录，Vercel 会自动识别并运行 `api/index.js`。

### api/index.js

这是 Vercel 的无服务器函数入口文件，包含：
- Express 应用
- API 路由
- 数据处理逻辑
- 静态文件服务

## 注意事项

### 数据持久化

Vercel 是无服务器平台，每次部署或冷启动时，JSON 数据文件可能会重置。

**建议：**
1. 定期备份 `visitors.json`、`guestbook.json` 和 `stats.json`
2. 考虑使用外部数据库（如 MongoDB Atlas、Firebase）
3. 或使用支持持久化存储的平台

### 环境变量

当前配置不需要额外的环境变量。Vercel 会自动设置：
- `NODE_ENV`: production

### 函数限制

- 最大执行时间：10 秒
- 最大内存：1GB

## 功能特点

- 🏠 响应式个人主页
- 👥 访客登录系统
- 💬 留言板功能
- 📊 访客统计分析
- 🎨 现代化 UI 设计
- 🚀 Vercel 无服务器部署

## 管理员信息

- 手机号: 17707179919
- 密码: 20061018llf

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML5 + CSS3 + JavaScript
- **部署**: Vercel (Serverless Functions)
- **数据存储**: JSON 文件

## 常见问题

### Q: 部署后数据会丢失吗？
A: 是的，Vercel 无服务器环境会在重新部署时重置文件系统。建议定期备份数据文件。

### Q: 如何解决数据持久化问题？
A: 
1. 迁移到外部数据库（MongoDB Atlas、Firebase）
2. 使用云存储服务
3. 定期导出数据文件作为备份

### Q: 本地开发和 Vercel 部署有什么区别？
A:
- 本地开发使用 `server.js`
- Vercel 部署使用 `api/index.js`
- 两者功能相同，只是入口不同

## 联系方式

如有问题或建议，请通过以下方式联系：
- 网站留言板
- 邮箱: [您的邮箱]

---

**注意**: 本项目仅用于学习和展示目的。生产环境建议使用外部数据库。