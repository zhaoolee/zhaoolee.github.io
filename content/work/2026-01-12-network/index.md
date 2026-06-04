---
title: "公司内网使用Clash Party tun模式，保持内部DNS解析内部域名的技巧"
date: 2026-01-12
categories: ["实用IT技术"]
draft: false
---

## Clash Party 的Tun模式是如何工作的

Clash Party（以及大多数 Clash 客户端）的 TUN 模式是一种系统级的网络接管技术。它的核心原理是欺骗操作系统，让系统认为有一个新的“物理网卡”存在，从而把所有网络流量都“吸”进去。

收到请求 -> Tun网卡 -> (Clash 立即返回假 IP) -> 建立连接 -> Clash 在后台进行远端解析/分流

## 「覆写」有什么用？

机场提供的订阅文件通常是“只读”的。覆写功能允许你在不修改原订阅文件的情况下，注入你自己的个性化设置。

## 「DNS覆写」有什么用？

让公司内网的域名，可用于内网的域名解析，

同时配合「覆盖DNS策略」，可以只让特定域名走内网

配合「真实IP回应」，可以让内网服务器IP显示在浏览器


### 如何查看dns

```
scutil --dns | grep nameserver
```

## 为什么要开「Tun模式」？

完美接管所有请求

接管无代理配置的软件：很多软件（如 Outlook、终端、游戏）不走系统代理设置，只有开 TUN 模式才能强制它们走 Clash。

处理 DNS 污染：强制所有 DNS 查询经过 Clash 的加密通道，防止被运营商劫持。


## 如何在办公网络下能同时支持内网DNS与tun模式的科学上网

1. 设置排除自定义网段，比如我的办公室网络有192.168.*.* 就排除自定义网段 192.168.0.0/16

![Clash Party TUN 模式排除办公室内网网段的配置截图](index.assets/7077d7181e88e6cdc2ccd0e3adba113cb9fd5d4b2975178611ac3c0dd00302f5.png)


2. 添加覆写规则，匹配公司一级域名作为后缀，添加直连

![Clash Party 添加公司域名直连覆写规则的截图](index.assets/0ea3c24e78c85884a07b5ff68ae0e491044edfbd05edf30477fefce5e89a335b.png)

![Clash Party 公司域名后缀匹配规则配置截图](index.assets/f9e1bc778cd44a2397f15dedd817dccac6872c37f9a4f8820276fdf0016543b5.png)

3. 对公司一级域名回应真实IP，并使用内网DNS解析

![Clash Party 对公司域名回应真实 IP 并使用内网 DNS 的配置截图](index.assets/03d378c3b60f8c5abceda69bcec909401028c6fbaae2d319c51f0a73672866bd.png)

