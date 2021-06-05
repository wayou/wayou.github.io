---
layout: post
title: "内容协商/ Content Nagotiation"
date: 2020-05-09T12:23:46Z
---
# HTTP 内容协商/ Content Nagotiation

访问同一个 URI 时，服务器可以返回不同类型的资源。比如在浏览器中访问 `http://www.example.com/user` 可以是个网页，也可以是个 JSON 接口，甚至可以是张图片等。

具体返回哪种类型，就需要引入内容协商的机制，以达到返回正确资源类型的目的。

内容协商分为服务器主导（server driven）和客户端主导（agent-driven negotiation / reactive negotiation）两种方式。

![Resource on the server](https://user-images.githubusercontent.com/3783096/76588210-6de0da00-6521-11ea-8c91-f7fd4b3268a2.png)
<p align="center">资源请求及返回过程 -- 图片来自 MDN</p>

## 服务器主导

![Resource on the server](https://user-images.githubusercontent.com/3783096/76588225-789b6f00-6521-11ea-99df-4bc2b13c43d5.png)
<p align="center">服务器主导的内容协商 -- 图片来自 MDN</p>

端上面发送 `Accept` 请求头，列出期望的 MIME 类型，多种类型用逗号分隔，并且可为每种类型指定相应权值。

示例：

```
GET /URL HTTP/1.1
Accept: text/*
Accept-Language: en
Accept-Encoding: br, gzip;q=0.8
```

常用端上发送的请求头有：

- `Accept`：指定接收的 MIME 类型
- `Accept-Charset`：指定接收的文本编码，比如 utf-8
- `Accept-Encoding`：指定压缩类型，比如 `br, gzip;q=0.8`
- `Accept-Language`：指定语言

服务器通过返回 `Vary` 响应头告知客户端哪些 Header 被采用，如果返回的是 `*` 则表明还有除了请求头之外的其他因素加入到了决策中。该响应头主要为了方便端上面的缓存能够正常工作。

## 客户端主导

![Resource on the semer](https://user-images.githubusercontent.com/3783096/76588251-82bd6d80-6521-11ea-9566-336e12ba9ef2.png)

<p align="center">客户端主导的内容协商 -- 图片来自 MDN</p>

当 URI 对应多种资源时，服务器一并返回，由端上自行决定取哪个。


## 总结 

服务器主导其缺点如下：

- 客户端请求头会比较繁多和复杂，增加了带宽成本
- 同时需要服务器去解析和处理相应决策逻辑，增加了服务器成本
- 不够灵活，假如需要增加其他的协商条件，端上需要新增请求头，服务器也需要新增处理逻辑。
- 请求头过多暴露的信息越多，会有安全隐患


客户端主导缺点如下：
- 多了次请求
- HTTP 协议中并未规定用于客户端进行选择的格式，这部分实现不统一

## 相关资源

- [MDN - Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)
