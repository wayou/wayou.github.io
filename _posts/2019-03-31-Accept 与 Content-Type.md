---
layout: post
title: "Accept 与 Content-Type"
date: 2019-03-31 12:03:00 +0800
tags:
---

# Accept 与 Content-Type

- Accept 表示请求方希望的资源类型，或者能解析识别的类型
- Content-Type 表示实际发送的资源类型

这里资源类型通过 [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 表示。

### Accept

Accept 是浏览器发送的请求头，用于表示想要的资源类型。根据请求的上下文不同，所设置的 Accept 请求头会相应变化。服务器根据 [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) 规则选择最合适的类型设置 `Content-Type` 并返回。

例如请求路由页面时，Chrome 设置 Accept 为

```
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
```

对于页面中的样式文件 css，其 Accept 为：

```
Accept: text/css,*/*;q=0.1
```

可用的值有以下几种：

- `<MIME_type>/<MIME_subtype>`，精确指定，示例： `text/html`。
- `<MIME_type>/*`, 不限制子类型，比如 `image/*` 会匹配 `image/png`, `image/svg`, `image/gif` 以及其他任何图片类型。
- `*/*` 任意 MIME 类型。
- `;q= (q-factor weighting)` 多种类型组合的情况，通过指定权重（[quality value](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values)）来表明每种类型的优先级。

#### Quality value

Header 中逗号分隔的值，每项的权重，或优先级。
比如：

```
text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```

表示：

| 值                                     | 优先级 |
| :------------------------------------- | :----- |
| `text/html` 和 `application/xhtml+xml` | `1.0`  |
| `application/xml`                      | `0.9`  |
| `*/*`                                  | `0.8`  |

### Content-Type

用来表示资源的类型。某些情况下，浏览器会对资源的类型进行嗅探而忽略掉服务器返回的 `Content-Type`。如果想强制客户端使用服务器返回的类型，可加上 `X-Content-Type-Options:nosniff` 响应头。

支持的值有：

- `media-type`，常见的 Content-Type 可 [参考这里](https://stackoverflow.com/a/48704300/1553656)。
- `charset`，指定资源编码类型。
- `boundary`， 多个资源实例情况下，指定资源的分界符。比如 form 表单提交时分隔多个表单字段，见后面示例。

一般情况下，包含在由服务器发送给客户端的响应头里。但也存在浏览器发送给服务器的情况，比如 POST 请求，表单提交这种由浏览器向服务器发送数据的情况下。

#### 表单的提交类型

form 表单中，提交的内容类型通过表单的 `enctype` 属性来指定。包含两种：

- `application/x-www-form-urlencoded` 较古老的格式，只支持简单文本，不支持文件上传。
- `multipart/form-data` 较新，支持文件上传，尺寸较大的二进制数据等。

#### 一个表单提交示例

通过 koa.js 搭建一个简单的表单提交示例，以查看 Content-Type。

_server.js_

```js
const { createReadStream } = require("fs");
const Koa = require("koa");
const app = new Koa();
const router = require("koa-router")();
const koaBody = require("koa-body");

router
  .get("/", async (ctx) => {
    ctx.type = "html";
    ctx.body = createReadStream("form.html");
  })
  .post(
    "/submit",
    koaBody({
      multipart: true,
    }),
    (ctx) => {
      console.log("form data is:", ctx.request.body);
      ctx.body = JSON.stringify(ctx.request.body);
    }
  );

app.use(router.routes());

app.listen(3000);

console.log(`server started at http://localhost:3000`);
```

_form.html_

```html
<form action="/submit" method="POST" enctype="multipart/form-data">
  foo:<input type="text" name="foo" /> bar:<input type="text" name="bar" />
  <button type="submit">submit</button>
</form>
```

访问页面并提交后，可在 Chrome DevTools 网络面板看到，`/submit` 这个 POST 请求相关的信息：

Request Headers

```
…
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryNgS8sggyuawQSr8W
…
```

Form Data

```
------WebKitFormBoundaryNgS8sggyuawQSr8W
Content-Disposition: form-data; name="foo"

1
------WebKitFormBoundaryNgS8sggyuawQSr8W
Content-Disposition: form-data; name="bar"

2
------WebKitFormBoundaryNgS8sggyuawQSr8W--
```

这里 `------WebKitFormBoundaryNgS8sggyuawQSr8W` 便是上面提到的 `boundary `，用以分隔表单内容字段。

### 内容协商/Content Negotiation

前面提到客户端通过设置 Accept 请求头设置请求资源的类型，服务器根据 content negotiation 规则返回。

Content negotiation 是这么一种机制，同一 URI 可响应多种资源，客户端可自行决定请求何种资源（譬如文档的语言，图片格式，文件编码类型）。

![image](https://user-images.githubusercontent.com/3783096/50970937-c2ec1f00-151d-11e9-8c8e-9e98e742a626.png)
_来自 MDN 展示内容协商流程的图片_

内容协商包含两种方式：

- 客户端通过设置请求头由服务器决定合适的类型进行返回（服务器驱动 ）。
- 服务器通过设置响应头中响应代码为 300 （`Multiple Choices`）或 406 （`Not Acceptable`）作为备用方案（客户端驱动）。

除了 Accept ，用于主动发起内容协商的请求头还有：

- `Accept-Charset`：期望的字符集。
- `Accept-Encoding`：期望的编码方式。
- `Accept-Language`：期望的语言。

#### 服务器驱动的内容协商

由客户端发送一组期望的类型，服务器根据自己的算法决定出最合适的类型进行返回，具体实现因服务器类型而异。服务器驱动是最常见的方式，但其也有一些明显的缺点：

- 由于不是完全了解客户端的兼容性，服务器的返回有时候存在局限性。相反，客户端驱动的是服务器返回多个选择，客户端根据自己的情况选用最合适的，因为客户端自己最了解自己支持哪些。
- 关于客户端的信息在多次请求中会冗余（当然，请求头冗余的情况在 HTTP/2 中有所缓解），也存在安全隐患（HTTP fingerprinting）。
- 多种类型的资源被返回后，服务端的缓存策略不再那么有效并且实现会变得复杂。

#### 客户端驱动的内容协商

![image](https://user-images.githubusercontent.com/3783096/50970964-d13a3b00-151d-11e9-9538-d1264cb71f2b.png)
_来自 MDN 展示客户端驱动内容协商流程的图片_

得到真实资源前多了一次选择的请求。

### 参考

- [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
- [Difference between the Accept and Content-Type HTTP headers](https://webmasters.stackexchange.com/questions/31212/difference-between-the-accept-and-content-type-http-headers)
- [Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)
- [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
