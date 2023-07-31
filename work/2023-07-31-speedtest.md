# Linux通过命令行测试服务器上传下载的带宽


由于阿里云的续费价格超贵, 我的网站阿里云迁移到了天翼云。

阿里云的带宽为5MB, 天翼云的带宽为10MB, 为了测试服务器的带宽是否足量, 推荐一个在命令行直接测试服务器带宽的工具 **speedtest-cli**



## 安装 speedtest-cli

CentOS 安装命令

```
yum install speedtest-cli -y
```

ubuntu 安装命令

```
apt install  speedtest-cli -y
```



## 测试带宽，输入`speedtest-cli` 命令即可

测试带宽为5MB的阿里云

![测试带宽为5MB的阿里云](https://github.com/zhaoolee/GBlog/assets/15868458/085793d6-bfa8-41ee-87c3-03b9e9c21c1a)



测试10MB带宽的天翼云


![测试10MB带宽的天翼云](https://github.com/zhaoolee/GBlog/assets/15868458/13fa796b-2131-43da-9313-8c40e1736a9b)

## 小结

对于网站应用而言，服务器带宽是很重要的指标，访问人数一定的情况下，服务器带宽越高，网站打开的速度越快。

如果你想通过内网穿透远程访问家里的电脑设备，带宽的提升，将会让你拥有更流畅的体验。