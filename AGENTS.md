# AGENTS.md

## 1. 项目定位（Project Positioning）

本网站不是传统博客，而是一个：

> **基于真实经验的技术解决方案库（Practical Guides / Workflows）**

核心目标：

* 提供可直接复用的“做法”
* 建立个人品牌信任（通过真实使用经验）
* 通过推荐工具/服务实现长期变现（affiliate / 引流）

---

## 2. 核心原则（Core Principles）

### 2.1 先解决问题，再展示能力

❌ 不要优先展示“我是谁”
✅ 优先回答“你能帮我解决什么问题”

结构顺序必须是：

1. 场景（问题）
2. 方案（解决路径）
3. 工具（实现手段）
4. 作者（信任背书）

---

### 2.2 场景优于分类

❌ 软件分类（无效）
❌ 工具列表（弱转化）

✅ 必须使用“场景驱动”：

* 写博客
* 远程打游戏
* 自动备份
* 信息获取（RSS）
* AI工作流

---

### 2.3 内容必须可复现

每一个方案必须满足：

* 有明确步骤
* 有工具组合
* 有真实使用经验
* 可被用户直接复制

---

### 2.4 真实优先（极重要）

* 只推荐自己长期使用的工具
* 必须包含踩坑经验
* 必须说明“为什么不用其他方案”

---

## 3. 网站整体结构（Site Architecture）

### 3.1 内容分区（Hugo Sections）

```
content/
  guides/        # 核心：做法（最重要）
  software/      # 软件推荐（素材库）
  hardware/      # 硬件推荐（素材库）
  project/    # 开源项目（能力背书）
  log/           # 杂谈（弱入口）
```

---

### 3.2 首页结构（Homepage Structure）

首页必须是“场景入口”，而不是个人介绍。

#### 第一屏（核心）

展示 3~5 个场景卡片：

* Build a Blog
* Remote Gaming
* Backup System
* Dev Workflow
* AI Workflow

👉 每个卡片 → guides 页面

---

#### 第二屏（信任背书）

* GitHub Star
* 开源项目
* 技术能力说明

---

#### 第三屏（资源补充）

* 软件推荐
* 硬件推荐

---

#### 第四屏（弱入口）

* Log / Thinking

---

## 4. URL 与 SEO 规范（SEO Strategy）

### 4.1 主目录

```
/guides/
```

---

### 4.2 URL 示例

```
/guides/build-blog/
/guides/remote-gaming/
/guides/backup-system/
```

---

### 4.3 标题规范（极重要）

统一使用：

```
How I [解决问题] with [工具组合]
```

示例：

* How I Build a Blog with Hugo
* How I Play Games Remotely with Moonlight
* How I Backup My Servers Automatically

---

## 5. Guide 页面结构（核心模板）

每个 guides 页面必须遵循以下结构：

### 5.1 场景描述（Problem）

* 用户面临的问题
* 使用场景
* 共鸣

---

### 5.2 常见错误（Mistakes）

* 常见但不优的方案
* 为什么不好

---

### 5.3 我的方案（Solution）

* 完整流程
* 工具组合
* 架构说明

---

### 5.4 为什么这样选（Reasoning）

* 工具对比
* 成本 / 性能 / 稳定性
* 实际踩坑

---

### 5.5 工具列表（Tools）

* 工具名称
* 简要说明
* 外链（affiliate）

---

### 5.6 可复用资源（Optional）

* 配置
* 模板
* 脚本

---

## 6. Hugo 技术实现规范

### 6.1 使用 Section 管理内容

* guides 为核心
* 其他作为素材库

---

### 6.2 使用统一模板

```
layouts/guides/single.html
```

统一渲染：

* 场景结构
* 工具卡片
* CTA

---

### 6.3 使用 Shortcodes

用于：

* 工具卡片
* 推荐区块
* 按钮（affiliate）

---

### 6.4 使用 data 文件

```
/data/tools.yaml
```

统一管理工具信息，避免重复维护。

---

## 7. 项目（Projects）策略

### 7.1 角色定义

* 项目 = 信用资产（Authority）
* Guides = 变现资产（Conversion）

---

### 7.2 结构

```
/project/
```

仅展示高价值项目（3~5个）

---

### 7.3 使用方式

在 guides 页面中：

👉 引用项目作为能力证明

---

## 8. 内容策略（Content Strategy）

### 8.1 优先级

1. Guides（最重要）
2. Software / Hardware（素材）
3. Log（表达）

---

### 8.2 写作频率建议

* 每周：1 个 Guide（核心）
* 辅助：从旧内容中引用

---

### 8.3 内容复用

* 软件推荐 → guides 中引用
* 开源项目 → guides 中引用
* 杂谈 → log 中保留

---

## 9. 架构原则（Static First）

### 9.1 使用静态站（Hugo）

原因：

* 成本低
* 抗攻击
* 易部署
* SEO友好
* AI抓取友好

---

### 9.2 动态功能（未来）

仅在必要时增加：

* 评论
* 登录
* API / 工具服务

---

## 10. 最终目标（North Star）

打造一个：

> **被用户信任的技术解决方案站点**

用户心智：

👉 “遇到问题 → 来这里找方案 → 直接照做”

---

## 11. 一句话总结

> **用真实经验构建可复现的解决方案，用场景驱动流量，用信任完成转化。**

---



# 项目约定

- 使用 `github.com/zhaoolee/notes` 的风格。
- 这是 Hugo 站点，文章采用 Hugo 原生 leaf bundle：`index.md` 配合 `index.assets/`。
- 不要恢复旧 Docsify 结构；当前有效内容在 `content/`，模板在 `layouts/`，全站静态资源在 `static/`。
- `assets/css/site.css` 是 Hugo 版锤子便签纸张风格样式。
- `archetypes/default/` 是新文章模板，会创建 `index.md` 和 `index.assets/`。

## 常用命令

```bash
hugo server --renderToMemory --noBuildLock --disableFastRender
hugo
```

预览草稿：

```bash
hugo server -D
```

## 新文章

直接创建 Hugo leaf bundle：

```bash
hugo new content log/2026-06-03-example
```

生成结构：

```text
content/log/2026-06-03-example/
├── index.assets/
│   └── .gitkeep
└── index.md
```

用 Typora 打开 `index.md` 写文章，图片复制位置设置为：

```text
./index.assets
```

发布前把 `draft: true` 改成 `draft: false`。新文章会自动出现在左侧栏对应栏目下。



## HUGO主题调优

- 支持按文章发布时间或专题查看
- Gitbook结构，左侧文章列表，右侧文章结构导航
- 文章与图片在相同目录，方便分享，Typora编辑友好


## 本地预览

```bash
hugo server --renderToMemory --noBuildLock --disableFastRender
```

## 构建

```bash
hugo
```

## GitHub Pages 部署

推送到 `master` 后，GitHub Actions 会自动构建并部署到 GitHub Pages。

仓库设置里需要选择：

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

自定义域名使用：

```text
zhaoolee.com
```

## 新建文章

```bash
hugo new content log/2026-06-04-new-post
```

新文章会生成 Hugo leaf bundle：

```text
content/log/2026-06-04-new-post/
├── index.assets/
│   └── .gitkeep
└── index.md
```

用 Typora 打开 `index.md`，图片复制位置设置为：

```text
./index.assets
```
