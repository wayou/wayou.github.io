---
layout: post
title: "JSON Web Token 介绍"
date: 2019-02-01 19:02:00 +0800
tags: 
---
    
JSON Web Token 介绍
===

### 什么是 JSON Web Token

[JSON Web Token (JWT)](https://jwt.io/introduction/) 是一个开放协议，通过简洁的 JSON 数据来达到安全交换数据的目的。

它是由逗号分隔的三个部分组成
    - Header
    - Payload
    - Signature
所以看起来是这种形式  `xxx.yyy.zzz`。

主要应用场景有身份验证（比如 native app 中）和数据交换。

### Header

Header 包含两部分：
- token 类型，`JWT`
- 签名算法，比如 `HMAC SHA256`，`RSA`

一个 Header 示例：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Header 经过 Base64Url 编码后形成了 JWT token 中的第一部分。

### Payload

Payload 包含声明（claims）数据，主要是 user 及其他额外的数据。声明分三种类型：

- Registered claims：一些非强制但推荐的预设声明，能够提供有用互联的信息，譬如 iss (issuer), exp (expiration time), sub (subject), aud (audience) 等。注意到这些名称都是三个字符，因为 JWT 要求数据简练。
- Public claims：具体使用时自由定义的部分。为防止冲突，应该定义在  [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml) 或能够避免冲突的 URI 命名空间下。
- Private claims：收发双方约定的私有声明，用来交换数据。

一个 Payload 示例：
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

Base64Url 编码后形成 JWT token 的第二部分。

*备注：对于已经通过签名以防止信息被篡改的 token 中，Payload 和 Header 对任何人都是可见的，所以不要在其中放置私有信息，除非是信息本身已经加密过。* 

### Signature

使用前面编码过的 Header, Payload，及 Header 中指定的签名算法，再加上一个 secret 便可以创建一个签名了 （signature）。

以 `HMAC SHA256` 算法为例，创建签名的方式会是下面的样子：

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

该签名可用来保证信息传输过程中没有被篡改，同时，如果使用私有键值进行签名，还可以从 token 中解析出 JWT 的发送者是谁。

上面签名的输出是逗号分隔的三个 Base64-URL 字符串，可在 HTML 及 HTTP 环境下自由使用了。相比基于 XML 的方案，比如 SAML，JWT 可以说是很简练了。

上面的签名指定 secret 为 `test` 时的结果：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.sLYApJ08mxtW8hlSqE5zetiscOjzEt361dCUDtGsDxU
```

### 调试工具


通过 [JWT 官网的 debugger](http://jwt.io/) 可在线生成和解析 token。


### 工作原理

用户登录后会得到一个 token，后续在请求受身份保护的资源时需要将该 token 带上。一般地，在请求头里通过 `Authorization` 字段以 Bearer 格式发送。

示例：

```
Authorization: Bearer <token>
```

Server 端检查 Header 中的 `Authorization` 字段以验证身份。

因为 JWT 通过 Header 传递身份，所以规避了跨域资源共享（CORS）的问题。

![image](https://user-images.githubusercontent.com/3783096/52120460-5addb400-2657-11e9-9e16-519c75f128a1.png)

![client-credentials-grant](https://user-images.githubusercontent.com/3783096/52120181-73010380-2656-11e9-81a7-554dda5a394f.png)

_来自 JWT 官网的图片展示了 Server 如何获取 token 并验证身份_
1.  _客户端通过验证身份后拿到token_
2.  _通过该token 再去请求其他受保护的资源_


### JWT 的优势

与 Simple Web Tokens (SWT) 和 Security Assertion Markup Language Tokens (SAML) 相比，JWT 会有一些优势。

相比 XML 方式，JWT 数据编码后更轻巧，这样便于 HTTP 传输和插入 HTML 中使用。

更加便捷的安全性。SWT 只能通过 HMAC 算法通过公用的 secret 来对称加密，而 JWT 和 SAML 可使用一对 公钥/私钥 进行 X.509  证书形式的签名。

JSON 格式在各编程语言中有广泛支持，而 XML 的解析则更加麻烦一些。


### 相关资源
- [Introduction to JSON Web Tokens](https://jwt.io/introduction/)
- [Get Started with JSON Web Tokens](https://auth0.com/learn/json-web-tokens/)
- [讲真，别再使用JWT了](http://insights.thoughtworkers.org/do-not-use-jwt-anymore/)
    