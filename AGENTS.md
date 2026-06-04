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
hugo new content chat/2026-06-03-example
```

生成结构：

```text
content/chat/2026-06-03-example/
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
hugo new content chat/2026-06-04-new-post
```

新文章会生成 Hugo leaf bundle：

```text
content/chat/2026-06-04-new-post/
├── index.assets/
│   └── .gitkeep
└── index.md
```

用 Typora 打开 `index.md`，图片复制位置设置为：

```text
./index.assets
```
