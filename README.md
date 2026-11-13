# 苏和の博客 (astro-supeace)

这是我的个人博客，基于 [Astro](https://astro.build/) 与 [astro-koharu](https://github.com/cosZone/astro-koharu) 主题搭建。

- **站点地址**：[https://su-peace.github.io](https://su-peace.github.io)
- **技术栈**：Astro + React + Tailwind CSS + Pagefind

---

## 快速开始

### 环境要求
- Node.js `>= 22.20.0`
- pnpm `10.28.2`

### 常用命令

```bash
# 1. 安装依赖
pnpm i

# 2. 启动本地开发服务 (http://localhost:4321)
pnpm dev

# 3. 构建静态文件 (输出到 dist/)
pnpm build

# 4. 本地预览构建产物
pnpm preview
```

### 内容与 CLI 工具

项目内置了交互式 CLI，方便日常写作与维护：

```bash
pnpm koharu          # 打开交互式菜单
pnpm koharu new post # 交互式新建文章
pnpm koharu backup   # 备份文章与配置
pnpm cms             # 启动本地可视化轻 CMS (http://localhost:4322)
```

---

## 项目结构

```plain
├── config/
│   └── site.yaml          # 核心配置文件（站点信息、导航、社交链接、功能开关等）
├── src/
│   ├── content/blog/      # 博客文章 (Markdown / MDX)
│   ├── components/        # UI 组件
│   └── pages/             # 路由与独立页面
├── public/                # 静态资源（头像、图片等）
└── scripts/               # 实用脚本与 CLI
```

---

## 写作说明

博客文章存放在 `src/content/blog/` 目录下，新建文章头部（Frontmatter）基本格式示例：

```markdown
---
title: 我的新文章
date: 2026-11-14 00:00:00
categories:
  - 学习
tags:
  - 随笔
  - 记录
cover: /img/default-cover.webp
---

这里是正文内容...
```

---

## 致谢

- 主题模板：[cosZone/astro-koharu](https://github.com/cosZone/astro-koharu)
