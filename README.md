# Zirflow Office

**AI 虚拟办公室 — 智能体团队协作平台**

Zirflow Office 是一个基于 Cloudflare Pages 的 AI 虚拟办公室前端应用，提供智能体（Agent）团队的可视化管理和协作界面。

## 功能概览

- **虚拟办公室** — 2D 可视化办公室地图，展示在线 Agent 和团队成员
- **Agent 管理** — 创建、配置、监控 AI 智能体
- **工作流编排** — 可视化工作流编辑（集成 n8n）
- **团队模板** — 开箱即用的团队预设模板
- **客户端接入** — 企业客户登录与配置管理

## 项目结构

```
zirflow-office/
├── public/                    # 静态站点目录（部署根目录）
│   ├── index.html            # 办公室主界面
│   ├── login.html            # 登录页面
│   └── templates.html        # 团队模板页面（备用）
├── functions/                 # Cloudflare Pages Functions（API）
│   └── api/
│       ├── login.ts          # 用户登录 API
│       └── register.ts       # 用户注册 API
├── .github/workflows/         # GitHub Actions 工作流
│   └── watch-competitors.yml # 竞品自动监控
├── reports/                   # 竞品监控报告
├── scripts/                   # 辅助脚本
│   └── check-updates.js      # 竞品更新检查
├── wrangler.toml             # Wrangler 部署配置
├── package.json              # 项目 + 脚本定义
└── .gitignore
```

## 技术栈

| 层 | 技术 |
|---|---|
| **前端** | 原生 HTML/CSS/JS（无框架，轻量快速） |
| **部署** | Cloudflare Pages + Functions |
| **后端 API** | Cloudflare Pages Functions (TypeScript) |
| **工作流引擎** | n8n（自建） |
| **CI/CD** | GitHub Actions |
| **存储** | 规划中：Baserow / Cloudflare KV |

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器（http://localhost:8788）
npm run dev

# 部署到 Cloudflare Pages
npm run deploy
```

## 部署

项目使用 **Cloudflare Pages** 部署，通过 `wrangler pages deploy` 命令或 Wrangler 配置文件：

```bash
# 方式一：直接部署
npm run deploy

# 方式二：指定环境
npx wrangler pages deploy public --branch production
```

部署后访问：`https://zirflow-office.pages.dev`

### 环境变量（规划中）

| 变量 | 用途 |
|---|---|
| `BASEROW_API_URL` | Baserow 数据库 API 地址 |
| `BASEROW_API_TOKEN` | Baserow 访问令牌 |
| `N8N_WEBHOOK_URL` | n8n 工作流触发地址 |
| `JWT_SECRET` | 登录态加密密钥 |

## 相关项目

- [zirflow-blog](https://github.com/Zirflow/zirflow-blog) — Zirflow 官方博客（Astro）
- [zirflow.com](https://zirflow.com) — 官网

## 许可

Proprietary — Zirflow 臻孚科技
