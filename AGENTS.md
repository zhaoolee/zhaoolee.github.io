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
