# astro-koharu 自定义与配置完整指南

`astro-koharu` 是基于 Astro 7.x 构建的高性能萌系/二次元风格博客。整个博客的绝大部分功能和外观都可以通过配置文件直接定制，同时也支持深度的主题源码与样式定制。

---

## 目录

1. [配置总览与文件结构](#1-配置总览与文件结构)
2. [站点基础信息配置 (`config/site.yaml`)](#2-站点基础信息配置)
   - 站点元数据与作者
   - 导航栏与社交图标
   - 友链系统
   - 全站公告栏
3. [外观、配色与字体定制](#3-外观配色与字体定制)
   - 主色调与设计系统 (`src/styles/theme/`)
   - 静态资源与图片替换 (`public/`)
   - 自定义字体
4. [内容与分类体系](#4-内容与分类体系)
   - 多级分类与 Slug 映射
   - 特色分类与精选专题 (Featured Series)
   - 文章 Frontmatter 完整定义
   - Shoka 增强语法与加密内容
5. [功能模块定制](#5-功能模块定制)
   - 评论系统 (Waline / Giscus / Remark42 / Twikoo)
   - 悬浮音乐播放器 (BGM / Meting)
   - 追番页面 (Bangumi API)
   - 落款系统 (Colophon 徽章与标识)
   - 在线 Markdown 写作室 (/editor)
   - 节日主题 (圣诞特效)
6. [多语言体系定制 (i18n)](#6-多语言体系定制-i18n)
   - 语言切换与路由
   - UI 界面文本与内容翻译
7. [新增独立页面 (About / 随笔等)](#7-新增独立页面)
8. [Koharu CLI 效率工具](#8-koharu-cli-效率工具)

---

## 1. 配置总览与文件结构

博客的核心配置遵循 **单一配置文件优先** 的设计哲学：

| 配置文件 / 路径 | 用途说明 |
| :--- | :--- |
| `config/site.yaml` | **核心配置文件**：包含站点、导航、友链、评论、分类、SEO、功能开关等 |
| `config/i18n-content.yaml` | 内容层面的国际化翻译（分类名、系列专题名、特色标签等） |
| `src/content/blog/` | 文章内容目录（Markdown / MDX） |
| `src/pages/` | 页面路由（创建 `.md` 或 `.astro` 即可添加新页面） |
| `src/styles/theme/` | 主题色调、CSS 变量、暗黑模式色彩定义 |
| `public/` | 静态资产存放目录（头像、Favicon、默认封面等） |

> [!NOTE]
> 修改 `config/site.yaml` 后，本地开发服务器会自动热重载或提示重新加载；如果修改了深层结构配置（如分类映射或系列路由），建议重启 `pnpm dev`。

---

## 2. 站点基础信息配置

所有全局设置均在 `config/site.yaml` 中配置。

### 2.1 站点元数据与作者
```yaml
site:
  title: 余弦の博客
  subtitle: 小春日和，温暖如初
  description: 记录生活与前端技术的个人小站
  author: cosine
  url: https://blog.cosine.ren  # 部署后的实际访问域名
  favicon: /favicon.ico
  avatar: /images/avatar.jpg    # 侧边栏/关于卡片的头像，位于 public/images/avatar.jpg
  cover: /images/cover.webp     # 首页顶部的默认主封面
  since: 2020                  # 建站年份
```

### 2.2 导航栏菜单 (`navigation`)
支持配置导航标题、跳转链接、图标（来自 Iconify）：
```yaml
navigation:
  - title: 首页
    path: /
    icon: ri:home-4-line
  - title: 归档
    path: /archives
    icon: ri:archive-line
  - title: 分类
    path: /categories
    icon: ri:folder-line
  - title: 友链
    path: /friends
    icon: ri:heart-line
  - title: 关于
    path: /about
    icon: ri:user-line
```

### 2.3 社交链接 (`social`)
显示在侧边栏头像下方：
```yaml
social:
  - name: GitHub
    icon: ri:github-line
    link: https://github.com/your-username
  - name: Bilibili
    icon: ri:bilibili-line
    link: https://space.bilibili.com/your-id
  - name: RSS
    icon: ri:rss-line
    link: /rss.xml
```

### 2.4 友情链接 (`friends`)
支持分组管理、头像与详细描述：
```yaml
friends:
  groups:
    - name: 推荐博友
      description: 经常互动的小伙伴们
      items:
        - name: 友商小站
          url: https://example.com
          avatar: https://example.com/avatar.png
          description: 专注于全栈开发的探索者
          tag: 前端
```

### 2.5 全站公告栏 (`announcements`)
无需后端，支持多条堆叠与过期时间控制：
```yaml
announcements:
  enabled: true
  items:
    - id: welcome-notice
      content: 欢迎来到我的新博客，欢迎常来留言交流！
      type: info # info | success | warning | danger
      closable: true
      # 可选：设置过期时间
      expiresAt: '2026-12-31T23:59:59Z'
```

---

## 3. 外观、配色与字体定制

astro-koharu 采用 Tailwind CSS 4.x + CSS 变量体系，默认是二次元经典的“樱花粉/蓝+白/深色”配色。

### 3.1 主题色彩变量

- **设计系统变量**：`src/styles/theme/shadcn.css`
  - `--primary`: 主色调（默认粉红色相 `351 77% 62%`）
  - `--background`: 页面背景
  - `--card`: 卡片背景
  - `--radius`: 全局圆角大小（默认 `0.75rem`）
  - `.dark` 作用域下为深色模式专属变量

- **特效与渐变色**：`src/styles/theme/index.css`
  - `--gradient-header`: 顶部 Header 的背景渐变
  - `--gradient-shoka-button`: Shoka 风格按钮的渐变
  - `--shoka-blue` / `--color-pink`: 强调色

如果想换成薄荷绿、海天蓝或紫罗兰等风格，只需在 `src/styles/theme/shadcn.css` 中修改对应的 HSL 数值即可全站生效。

### 3.2 静态资源替换

直接替换 `public/` 目录下的文件：
- `public/favicon.ico`: 网站图标
- `public/images/avatar.jpg`: 站长头像
- `public/images/cover.webp`: 默认文章和首页横幅大图

---

## 4. 内容与分类体系

### 4.1 分类与 Slug 映射
文章支持层级分类（例如 `['开发', '前端', 'React']`）。为了使 URL 友好，在 `config/site.yaml` 中配置中文到 URL 的映射：
```yaml
categoryMap:
  开发: dev
  前端: frontend
  生活: life
  周刊: weekly
```

### 4.2 精选专题 (Featured Series)
将特定的系列（例如周刊、读书笔记）单独设立精选专区，避免首页被连载刷屏：
```yaml
featuredSeries:
  - slug: weekly               # 访问路由: /weekly
    categoryName: 周刊         # 匹配文章的分类名称
    title: 前端漫游周刊
    description: 每周分享有趣的技术与设计
    cover: /images/series-cover.jpg
    highlightOnHome: true      # 仅在首页置顶高亮展示最新一期
```

### 4.3 文章 Frontmatter 规范
在 `src/content/blog/` 下编写 Markdown/MDX 文件：

```yaml
---
title: 我的第一篇博客文章
date: 2026-03-01 12:00:00
updated: 2026-03-02 15:30:00
categories:
  - 开发
  - 前端
tags:
  - Astro
  - React
cover: /images/posts/my-post-cover.webp # 可选，文章卡片与头部头图
pinned: false                          # 是否置顶
draft: false                           # 是否为草稿（构建时忽略）
password: ""                           # 可选，整篇加密文章密码（AES-256-GCM 保护）
colophon:                              # 可选，落款标识（原创/AI生成等）
  - original
toc: true                              # 是否显示目录导航（默认 true）
comment: true                          # 是否开启本篇评论（默认 true）
---

这里是文章正文……
```

### 4.4 Markdown 增强语法
- **Shoka 提醒块**：
  ```markdown
  :::note
  普通提示信息
  :::

  :::danger
  危险提示
  :::
  ```
- **折叠隐藏块 (Spoiler / Details)**：
  ```markdown
  :::spoiler[点击查看答案]
  这里是被折叠的内容。
  :::
  ```
- **文章局部加密块**：
  ```markdown
  :::encrypted[your-password]
  只有输入正确的密码才能解密阅读这段内容。
  :::
  ```
- **注音 (Ruby)**：`{汉字^hanzi}` 渲染为带注音的文本。

---

## 5. 功能模块定制

### 5.1 评论系统配置 (`comment`)
支持在 `config/site.yaml` 的 `comment.provider` 中切换：
```yaml
comment:
  provider: waline # 可选: waline | giscus | remark42 | twikoo | none
  waline:
    serverURL: https://your-waline-instance.vercel.app
    pageview: true     # 文章阅读量统计
    commentCount: true # 评论数统计
  giscus:
    repo: username/repo
    repoId: R_xxxxxx
    category: Announcements
    categoryId: DIC_xxxxxx
    mapping: pathname
```

### 5.2 悬浮音乐播放器 (`bgm`)
支持网易云歌单集成（基于 Meting API）：
```yaml
bgm:
  enabled: true
  autoPlay: false
  # Meting API 歌单配置 (type: playlist, id 为网易云歌单 ID)
  server: netease
  type: playlist
  id: "8152976474"
  metingApi: https://163.hyc.moe/ # 支持自建 Meting API
```

### 5.3 追番与影音页面 (`bangumi`)
无需手动同步，输入 Bangumi ID 自动拉取追番与收藏数据：
```yaml
bangumi:
  userId: your_bangumi_id  # 填写你的 Bangumi 用户名/数字 ID
  pageSize: 20
```

### 5.4 落款系统 (`colophon`)
在文末展示“原创声明”、“AI 辅助生成”、“转载授权”等徽章标记：
```yaml
colophon:
  enabled: true
  groups:
    - id: authorship
      exclusive: true
      marks:
        - id: original
          label: 原创
          icon: ri:creative-commons-by-line
          tone: success
        - id: ai-assisted
          label: AI 辅助
          icon: ri:sparkles-line
          tone: warning
```

### 5.5 在线写作室与本地编辑器跳转
- **在线编辑**：访问 `/editor` 即可打开浏览器内置的 Markdown 写作室，实时预览 Shoka 特效。
- **本地编辑器直达**：在 `config/site.yaml` 中的 `dev:` 配置本地 IDE（如 `vscode`, `cursor`, `zed`），本地开发时文章页会有直接唤醒本地编辑器的悬浮按钮。

---

## 6. 多语言体系定制 (i18n)

### 6.1 开启多语言
在 `config/site.yaml`：
```yaml
i18n:
  defaultLocale: zh
  locales:
    - code: zh
      label: 简体中文
    - code: en
      label: English
```

### 6.2 翻译文件结构
- **UI 翻译**：`src/i18n/translations/`
  - `zh.ts`：基准词条源
  - `en.ts` / `ja.ts`：覆盖翻译词条
- **内容翻译**：`config/i18n-content.yaml`（翻译分类名称与精选专题名称）
- **多语言文章**：直接将翻译版本放置在 `src/content/blog/<locale>/` 下，例如 `src/content/blog/en/my-post.md`。

---

## 7. 新增独立页面

如果需要新增“关于”、“书单”、“致谢”等独立页面：
1. 直接在 `src/pages/` 下创建 Markdown 文件（如 `src/pages/about.md`）：
   ```markdown
   ---
   title: 关于我
   description: 了解更多关于我的故事
   layout: ../layouts/PageLayout.astro
   cover: /images/about-cover.webp
   comment: true
   ---

   你好！欢迎来到我的个人主页……
   ```
2. 在 `config/site.yaml` 的 `navigation` 中添加指向 `/about` 的菜单项即可。

---

## 8. Koharu CLI 效率工具

项目内置了交互式 CLI，执行 `pnpm koharu` 即可启动终端管理面板，支持：

| 命令 | 作用说明 |
| :--- | :--- |
| `pnpm koharu new post` | 交互式新建文章（自动生成拼音 Slug、分类与 Frontmatter） |
| `pnpm koharu new friend` | 交互式追加新的友链并安全写入 `site.yaml` |
| `pnpm koharu backup` | 一键备份本地配置、博客文章与用户头像 |
| `pnpm koharu restore` | 从历史备份中还原数据 |
| `pnpm koharu update` | 智能拉取主题上游更新（自动执行备份并合并冲突） |
| `pnpm koharu generate all` | 一键生成 LQIP 渐变图片占位符与语义推荐向量 |

---

> 更多底层架构细节可参考 [docs/overview/00-overview.md](file:///e:/blog/astro-koharu/docs/overview/00-overview.md) 与 [AGENTS.md](file:///e:/blog/astro-koharu/AGENTS.md)。

