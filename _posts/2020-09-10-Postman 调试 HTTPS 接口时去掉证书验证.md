---
layout: post
title: "Postman 调试 HTTPS 接口时去掉证书验证"
date: 2020-09-10 23:09:00 +0800
tags: 
---
    
# Postman 调试 HTTPS 接口时去掉证书验证


如果机器对外有安全性要求，只能提供 HTTPS，同时还没绑定域名，使用 Postman 进行接口调试时，通过 IP 去访问机器上的服务是会报证书错误的：

```
GET https://<ip_of_my_server>:443/api/endpoint

Error: Hostname/IP does not match certificate's altnames: IP: <ip_of_my_server> is not in the cert's list:

```

在接口的设置界面关闭 `Enable SSL certificate verification` 选项即可绕开该报错。


![image](https://user-images.githubusercontent.com/3783096/92689847-61bfc300-f372-11ea-80d4-0b58bf975666.png)
<p align="center">关闭 Postman 接口的 SSL 证书检查</p>

    