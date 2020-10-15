---
layout: post
title: "Whistle mock 配置"
date: 2020-09-21 22:09:00 +0800
tags:
---

# Whistle mock 配置

## 安装依赖

```sh
$ npm i -g whistle.vase
```

## 配置 vase

安装完成后，Whistle 插件界面会有对应展示，点击名称后进入插件配置界面，创建一个新的 mock 规则，引擎选择 「mock」:

![image](https://user-images.githubusercontent.com/3783096/93778459-83fdee80-fc58-11ea-92bb-7adf34fcb1ba.png)

确定之后输入如下内容：

```json
{
  "list|3": [
    {
      "id|+1": 10000,
      "name": "@string",
      "avatar": "http://lorempixel.com/100/100/"
    }
  ]
}
```

更加详细的 mock 语法参见 [nuysoft/Mock Wiki](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)。

## 配置 Whistle 转发规则

添加 Whistle 转发规则，内容如下：

```
http://mock.local/test.json vase://sample_json
```

实际使用时，编写规则转发需要被 mock 的后端接口地址即可。

## 测试

完成上述配置后，访问 [http://mock.local/test.json](http://mock.local/test.json) 可以看到 mock 返回：

![image](https://user-images.githubusercontent.com/3783096/93778469-87917580-fc58-11ea-8274-e8a6ed8acced.png)

## 跨域问题

假如需要被 mock 的接口存在跨域的情况，浏览器会先发送 OPTIONS 请求。

而这个 OPTIONS 请求会因为代理没有返回正确的响应头配置而失败：

```
Access to fetch at 'https://some/api' from origin 'https://some/domain' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

此时需要配置 Whistle 的响应头，以允许跨域。

`resCors://*` 表示设置 `access-control-allow-origin: *`，在启用 credential 的情况下是不行的，所以此处使用 `resCors://enable`：

```
# `enable` 表示设置 access-control-allow-origin: http://originHost
# 及access-control-allow-credentials: true
# 可用于script标签上设置为 `crossorigin=use-credentials`的情形
https://some/api resCors://enable vase://sample_json
```

此设置虽然解决了跨域，但返回类型确不对：

```
content-type: text/html; charset=utf8
```

所以，进一步地，这里需要自定义响应头，将返回类型修正为 JSON。

在 Values 面板创建变量 `CORSHeaders` 内容为：

```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers,X-Requested-With,X-Custom-Headers
Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE
Access-Control-Allow-Origin: some_domain
Content-Type: application/json
```

其中需要注意 `Access-Control-Allow-Headers`，启用 `Access-Control-Allow-Credentials: true` 的情况下不能指定 `Access-Control-Allow-Headers:*`，因为此时 `*` 并不代表通配符的意思。只能将所有要允许的 header 列出来。

同时更新 Whistle 转发规则使用该变量：

```
http://some/api resHeaders://{CORSHeaders} vase://sample_json
```

## 相关资源

- [nuysoft/Mock Wiki](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)
- [Whistle 文档 - resCors](https://wproxy.org/whistle/rules/resCors.html)
- [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
