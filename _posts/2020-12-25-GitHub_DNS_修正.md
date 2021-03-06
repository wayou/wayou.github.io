---
layout: post
title: "GitHub DNS 修正"
date: 2020-12-25T14:19:13Z
---
# GitHub DNS 修正

## 配 hosts

如果发现 GitHub 打开慢或其中图片不加载，多半是相关资源的 DNS 解析有问题。修正方式是手动找到正确的 IP 并配置本地 HOST 以修正。

拿图片来说，

- 找到无法加载的图片地址 `https://avatars3.githubusercontent.com/xxx`

![image](https://user-images.githubusercontent.com/3783096/103136856-f6bab200-46fe-11eb-801f-ca4ef86158df.png)

- 随便一个工具网站查询该地址的 IP, 比如 [https://www.ipaddress.com/](https://www.ipaddress.com/)
- 将查询得到的 IP 配置到本地 hosts 文件，比如 mac 中，`sudo vi /etc/hosts`
- 一般来说，hosts 文件修改后是即时生效的，如果不行，手动刷新下 DNS 缓存 `sudo dscacheutil -flushcache`

## 配 DNS

以上，只针对固定域名，但 Github Pages 的域名是跟用户名有关的 `*.github.io`，即，没法用上面配 hosts 的方式来修正。所以如果想要正常访问 Github Pages，只能修正 DNS,你可以

- 本机使用 [dnsmasq](https://thekelleys.org.uk/dnsmasq/doc.html) 搭建 DNS 服务或
- 便捷的方式是直接修改网络的 DNS 配置为 `4.4.4.4`， `8.8.8.8` 等这些没有被污染的地址。

<img width="780" alt="Screen Shot 2021-07-10 at 10 43 08" src="https://user-images.githubusercontent.com/3783096/125149457-a02d3680-e16b-11eb-990d-621905d9660c.png">

以上。

## 相关资源

- [解决Github网页上图片显示失败的问题](https://blog.csdn.net/qq_38232598/article/details/91346392)
- [How do I refresh the hosts file on OS X?](https://superuser.com/a/346519)
