# Linux服务器之间迁移数据的技巧


由于阿里云过于昂贵，我将服务器切换到了天翼云，于是需要将阿里云数据复制到天翼云，Linux之间复制数据其实很简单，只需运行rsync命令即可。

rsync 其实就是"远程同步"（remote sync）的意思。与其他文件传输工具（如 FTP 或 scp）不同，rsync 的最大特点是会检查发送方和接收方已有的文件，仅传输有变动的部分（默认规则是文件大小或修改时间有变动）。

## 复制 服务器A文件夹内的各种文件 到 服务器B的文件夹

我有两台服务器A和B, 需要将A服务器Nginx配置文件目录 `/etc/nginx/conf.d` 中的内容 , 迁移到B服务器的Nginx配置文件目录 `/etc/nginx/conf.d`, 我们可以在B服务器运行以下命令, 其中`-a` 参数类似cp命令的 `-r`, `-a`可以被看做`-r`的增强版, 可以同步文件修改信息, 源文件被修改后, rsync可以对比修改信息进行更精确的增量同步; `-v` 命令可以输出同步细节，显示当前正在同步的文件名

```
rsync -av A服务器用户名@A服务器IP:/etc/nginx/conf.d/  /etc/nginx/conf.d
```



以上格式为 `rsync -av 源位置/ 目标位置`, 我们的A和B两台服务器都存在文件目录`/etc/nginx/conf.d`  我们想将A机服务器目录`/etc/nginx/conf.d`内的配置文件，复制到B服务器，就需要在A服务器的文件夹名称后添加`/`



## 复制 服务器A的文件夹 到 服务器B


Linux一般都存在/opt 文件夹, 用来存储软件包, 如果A服务器存在 `/opt/EasyTypora` 目录, B服务器不存在 `/opt/EasyTypora` 目录, 我们就可以使用以下命令进行同步


```
rsync -av A服务器用户名@A服务器IP:/opt/EasyTypora  /opt
```

运行命令后, B服务器 `/opt` 目录下会自动创建文件夹 `EasyTypora`, 并从A服务器同步`/opt/EasyTypora`中的内容到B服务器的`/opt/EasyTypora` 目录。


