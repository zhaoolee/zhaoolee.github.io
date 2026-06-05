# zhaoolee的自留地

![](./README.assets/747fd4bf606aa42aab68da5ba269122599f3bd7063eb0279bbe62adb1c0b96bf.png)

![](./README.assets/9b9797635df3b40f1bc4ff51e5696aa77cad59ad20de4b7a0251e3ad6f573f35.png)

本仓库是 **zhaoolee的自留地** 的托管仓库，网址 [zhaoolee.com](https://zhaoolee.com)

## RSS订阅

[zhaoolee.com/index.xml](https://zhaoolee.com/index.xml)

## 本地搜索预览

Pagefind 搜索需要先生成索引。本地使用 `hugo server` 调试搜索页时，另开一个终端运行：

```bash
bash scripts/pagefind-dev.sh
```

脚本会把索引生成到 `static/pagefind/`，让 `hugo server` 可以直接访问；文章、模板或样式变化后会自动重新构建 Hugo 并刷新 Pagefind 索引。

## 技术参考

请阅读本仓库的 AGENTS.md
