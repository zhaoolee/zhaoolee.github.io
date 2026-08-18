---
title: "How I 用 Linux 策略路由修复 Mihomo TUN 与 RustDesk 的冲突"
date: 2026-08-18T13:00:00+08:00
categories: ["做法"]
aliases:
  - /work/2026-08-18-mihomo-rustdesk/
draft: false
description: "Mihomo TUN 开启后，自建 RustDesk Server 无法正常连接。我通过 Linux ip rule 精确绕过 RustDesk 服务端回包，并使用 systemd 持久化。"
---

## 场景：Mihomo 一开，RustDesk 就无法连接

服务器上同时运行着 Mihomo 和自建 RustDesk Server。Mihomo 使用 TUN 模式接管系统流量，RustDesk 的 `hbbs`、`hbbr` 则通过 Docker Compose 以 host 网络模式运行。

开启 Mihomo 后，RustDesk 客户端长时间显示“正在接入 RustDesk 网络”，无法正常连接远程设备；停止 Mihomo 后，客户端几乎立刻恢复。

这个对照现象最终成为定位问题的关键：RustDesk 服务本身没有坏，真正的问题在 Mihomo 自动创建的 Linux 策略路由。

## 服务与端口

RustDesk OSS 服务端主要使用以下端口：

| 端口 | 协议 | 用途 |
| --- | --- | --- |
| 21115 | TCP | NAT 类型测试 |
| 21116 | TCP/UDP | ID 注册、心跳和连接协商 |
| 21117 | TCP | 中继服务 |
| 21118 | TCP | hbbs WebSocket |
| 21119 | TCP | hbbr WebSocket |

本次故障中，`21116/UDP` 很重要。排障期间曾在客户端禁用 UDP，虽然 TCP 绕行生效后已经可以发起远程控制，但客户端仍显示“正在接入”。重新启用 UDP 后，状态也恢复正常。

## 常见错误：为什么这些做法没有解决问题

### 1. 停掉旧 Clash

服务器上还残留着由 PM2 管理的旧 Clash 任务。为了避免两个代理程序同时修改路由，先停止并删除旧任务，再同步 PM2 保存列表：

```bash
sudo env PM2_HOME=/root/.pm2 /path/to/pm2 stop start_clash
sudo env PM2_HOME=/root/.pm2 /path/to/pm2 delete start_clash
sudo env PM2_HOME=/root/.pm2 /path/to/pm2 save
```

清理旧 Clash 是必要的，但 RustDesk 故障仍然存在，说明它不是唯一原因。

### 2. 检查和升级 RustDesk Server

`hbbs`、`hbbr` 的监听端口和日志均正常，随后将服务端升级至 1.1.16，并保留原有密钥和数据库：

```bash
cd /path/to/rustdesk
docker compose pull
docker compose stop

sudo mkdir -p data.bak-before-upgrade
sudo cp -a data/. data.bak-before-upgrade/
sudo diff -qr data data.bak-before-upgrade

docker compose up -d --force-recreate
docker exec hbbs hbbs --version
docker exec hbbr hbbr --version
```

升级排除了版本因素，但没有解决 Mihomo 开启时的连接问题。

### 3. 在 Mihomo 中添加 DIRECT 规则

配置中加入了 RustDesk 端口和进程的直连规则：

```yaml
rules:
  - SRC-PORT,21115-21119,DIRECT
  - DST-PORT,21115-21119,DIRECT
  - PROCESS-NAME,hbbs,DIRECT
  - PROCESS-NAME,hbbr,DIRECT
```

配置测试和重启都成功，但 RustDesk 依然异常。

这里有一个很容易混淆的概念：

> Mihomo 的 `DIRECT` 表示流量进入 Mihomo 后选择直连出口，不代表该流量从一开始就不会进入 TUN。

对于服务器正在接受的入站 TCP 连接，回包路径被 TUN 接管后，即使代理层最终选择 `DIRECT`，也可能已经破坏了原连接所需要的内核回程路径。

### 4. 排除 eth0 仍然无效

TUN 配置中还排除了服务器的物理网卡：

```yaml
tun:
  exclude-interface:
    - eth0
```

但 `exclude-interface` 解决的是“从哪个接口进入的流量需要被路由”。RustDesk 服务端回包是由本机进程产生的，不是从 `eth0` 进入的，因此没有可供它匹配的入站接口。

换句话说：排除 `eth0` 可以保护转发或入站流量，却不一定能保护本机监听服务生成的出站回包。

## 根因：RustDesk 回包被策略路由送入 Meta

检查 Mihomo 运行时的策略路由：

```bash
ip rule show
ip route show table 2022
```

可以看到类似规则：

```text
9000: from all iif eth0 goto 9010
9001: from all to 198.18.0.0/30 lookup 2022
9003: not from all iif lo lookup 2022
```

而路由表 2022 的默认出口是 Mihomo 的 TUN 网卡：

```text
default via 198.18.0.2 dev Meta
```

这说明：除去少数被提前放行的情况，本机产生的流量会优先查询表 2022，并从 `Meta` 进入 Mihomo。

RustDesk 客户端访问服务器时，请求能够到达 `hbbs`、`hbbr`；但服务端从 `21115–21119` 发出的回包又被路由进 TUN，造成连接协商、注册或 NAT 探测异常。

停止 Mihomo 后，相关策略路由消失，RustDesk 立即恢复，形成了完整证据链。

## 我的方案：让 RustDesk 回包优先查询主路由表

Linux 策略路由按照优先级从小到大匹配。Mihomo 的规则从 `9000` 开始，因此可以在它之前增加两条更精确的规则：

```bash
sudo ip rule add pref 8998 ipproto tcp sport 21115-21119 lookup main
sudo ip rule add pref 8999 ipproto udp sport 21116 lookup main
sudo ip route flush cache
```

检查结果：

```bash
ip rule show | head -20
```

预期能看到：

```text
8998: from all ipproto tcp sport 21115-21119 lookup main
8999: from all ipproto udp sport 21116 lookup main
9000: ...
```

两条规则分别表示：

- 源端口为 `21115–21119` 的 TCP 包直接查询系统主路由表；
- 源端口为 `21116` 的 UDP 包直接查询系统主路由表；
- 其他不匹配的流量继续向后匹配 Mihomo 的 `9000` 系列规则。

实际流量路径变为：

```text
RustDesk 回包
  -> 匹配 8998 或 8999
  -> 查询 main 路由表
  -> 从物理网卡直接发出

其他本机流量
  -> 不匹配 8998/8999
  -> 继续匹配 Mihomo 规则
  -> 进入 Meta TUN
```

应用规则后，在 Mihomo 保持开启的情况下，RustDesk 已经可以正常建立远程控制会话。这证明问题不在 RustDesk Server、密钥或中继服务，而在服务端回包的策略路由。

## 可复用配置：使用 systemd 持久化

直接执行的 `ip rule` 在服务器重启后会消失。为了让规则与 Mihomo 一同启动和清理，可以给 `mihomo.service` 增加 systemd drop-in：

```bash
sudo systemctl edit mihomo
```

写入：

```ini
[Service]
ExecStartPost=-/usr/sbin/ip rule del pref 8998
ExecStartPost=-/usr/sbin/ip rule del pref 8999
ExecStartPost=/usr/sbin/ip rule add pref 8998 ipproto tcp sport 21115-21119 lookup main
ExecStartPost=/usr/sbin/ip rule add pref 8999 ipproto udp sport 21116 lookup main
ExecStartPost=/usr/sbin/ip route flush cache

ExecStopPost=-/usr/sbin/ip rule del pref 8998
ExecStopPost=-/usr/sbin/ip rule del pref 8999
ExecStopPost=-/usr/sbin/ip route flush cache
```

其中：

- `ExecStartPost` 在 Mihomo 启动后执行；
- 启动时先删除旧规则，避免重复添加；
- 命令前面的 `-` 表示忽略非零退出状态，例如规则原本就不存在；
- `ExecStopPost` 在 Mihomo 停止后删除绕行规则；
- `ip route flush cache` 让路由变化立即生效。

保存后重新加载并重启 Mihomo：

```bash
sudo systemctl daemon-reload
sudo systemctl restart mihomo

systemctl is-active mihomo
ip rule show | head -20
```

重启后仍然存在 `8998`、`8999`，说明持久化成功。

## 为什么这样选

我没有选择长期关闭 Mihomo，因为服务器上的其他程序仍然需要代理能力；也没有把大段公网地址加入 TUN 排除列表，因为 RustDesk 客户端的公网 IP 会变化，范围过大的排除还容易造成不必要的流量泄漏。

Mihomo 支持按 UID 排除流量，但本次 `hbbs`、`hbbr` 容器使用 root 运行。直接排除 UID 0 会连带绕过大量系统服务，范围明显过大。若以后把 RustDesk 容器迁移到独立用户运行，按 UID 排除会是另一个可选方案。

使用源端口策略路由的优点是：

- 只匹配 RustDesk 服务端回包，不改变普通代理流量；
- 不依赖客户端公网 IP，适合动态地址；
- 规则处于 Linux 内核路由层，早于 Mihomo 的 TUN 接管；
- 可以通过 systemd 与 Mihomo 一起启动和清理；
- 改动小，验证和回滚都很直接。

需要注意的是，这种规则按端口而不是进程识别流量。如果其他程序占用了同一源端口，它也会走系统主路由。不过在这台服务器上，这组端口专门提供给 RustDesk，范围是可控的。

## 回滚方法

只回滚当前运行时的规则：

```bash
sudo ip rule del pref 8998
sudo ip rule del pref 8999
sudo ip route flush cache
```

若要永久回滚，还需要再次执行：

```bash
sudo systemctl edit mihomo
```

删除上述 RustDesk 相关的 `ExecStartPost`、`ExecStopPost` 配置，随后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl restart mihomo
```

如果原 drop-in 中还有其他配置，不要直接删除整个文件，只移除本次添加的内容。

## 最终验证清单

1. Mihomo 保持 `active`，不能通过关闭 Mihomo 来规避问题；
2. `ip rule show` 中存在优先级为 `8998`、`8999` 的规则；
3. `hbbs`、`hbbr` 正常监听 `21115–21119`；
4. RustDesk 客户端不要启用“禁用 UDP”；
5. 客户端状态恢复，并能真正建立远程桌面会话；
6. 重启 Mihomo 后再次验证，确认规则能够自动恢复。

## 工具列表

- [Mihomo](https://github.com/MetaCubeX/mihomo)：通过 TUN 模式为服务器提供透明代理能力。
- [RustDesk](https://github.com/rustdesk/rustdesk)：开源远程桌面客户端。
- [RustDesk Server](https://github.com/rustdesk/rustdesk-server)：提供自建 ID、连接协商和中继服务。
- `ip rule` / `ip route`：检查并调整 Linux 策略路由。
- systemd：让绕行规则与 Mihomo 生命周期保持一致。
- Docker Compose：运行和升级 `hbbs`、`hbbr`。

## 经验总结

这次排障最重要的经验有五点：

1. **用开关做对照实验。** Mihomo 一停，RustDesk 立刻恢复，这比反复修改 RustDesk 参数更有价值。
2. **`DIRECT` 不等于绕过 TUN。** 前者是代理层的出站策略，后者是内核层的路由选择。
3. **不要只看目的端口。** 对服务器回包而言，服务端口出现在源端口上，因此需要匹配 `sport`。
4. **`exclude-interface` 不等于排除本机进程。** 本机生成的包没有普通意义上的入站接口。
5. **UDP 不能随便禁用。** RustDesk 即使能通过 TCP 建立部分连接，注册、状态显示和 NAT 探测仍可能依赖 `21116/UDP`。

最终方案没有关闭 Mihomo，也没有让整台服务器全部直连，只给 RustDesk 的服务端口增加了精确、可回滚的主路由绕行规则。这比全局关闭 TUN 或排除大段地址更可控，也更适合长期运行。

## 参考资料

- [Mihomo TUN 配置说明](https://wiki.metacubex.one/config/inbound/tun/)
- [RustDesk Server OSS Docker 部署与端口说明](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/docker/)
- [RustDesk 自建服务端工作原理](https://rustdesk.com/docs/en/self-host/)
