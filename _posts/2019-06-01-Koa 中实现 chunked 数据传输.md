---
layout: post
title: "Koa 中实现 chunked 数据传输"
date: 2019-06-02 00:06:00 +0800
tags: 
---
    
# Koa 中实现 chunked 数据传输

有关于 `Transfer-Encoding:chunked` 类型的响应，参见之前的文章[HTTP 响应的分块传输](https://github.com/wayou/wayou.github.io/issues/85)。这里看 Koa 中如何实现。

## Koa 中请求返回的处理

虽然官方文档有描述说明不建议直接调用 `response.write`：

> Bypassing Koa's response handling is not supported. Avoid using the following node properties:
> 
> - res.statusCode
> - res.writeHead()
> - res.write()
> - res.end()

但要实现分片向客户端发送数据，必然还是得调用 Node.js Http 模块的 [response.write(chunk[, encoding][, callback])](https://nodejs.org/api/http.html#http_response_write_chunk_encoding_callback) 方法，而这里的 `response` 就是 `ctx.res` 或 `ctx.response`。

所以为什么 Koa 要说不建议直接调用上述方法操作请求的返回呢，我们来看看 Koa 内部对 response 都会做些什么默认的处理。

__application.js__
```js
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

在应用完各种中间件后（`fnMiddleware(ctx)`）通过 `handleResponse` 对请求进行一些操作，最终是在 `respond` 函数里。

<details>
<summary>
respond 方法
</summary>

```js
function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```
</details>

`respond` 方法里会根据外部是否有设置过 `ctx.body`，以及不同的 header 来设置 `ctx.body`，最终会调用 `response.end` 来结束掉本次请求。

注意到如果设置了 `ctx.respond = false`，这个方法就直接 `return` 了，这是一种跳过这里处理的方式。但其实如果我们在中间件中手动调用了 `ctx.res.end()` 后，相当于已经提前结束掉请求了，同样也不会走 Koa 这里的处理。

所以直接在中间件中调用 `ctx.res.write()` 及 `ctx.res.end()` 就可以实现 `chunked` 类型的响应，倒无须对 Koa 做额外设置。

## Koa 实现 chunked 数据传输

根据上面的分析，及之前一篇关于[HTTP 响应的分块传输](https://github.com/wayou/wayou.github.io/issues/85)的文章，我们得出以下 Koa 中的实现逻辑：

```js
const Koa = require("koa");
const app = new Koa();
const PORT = 3000;
app.use((ctx, _next) => {
  const res = ctx.res;
  ctx.status = 200;
  res.setHeader("Content-Type", "text/html");
  res.write(`start<br>`);
  return new Promise(resolve => {
    let i = 0,
      total = 5;
    while (i <= total) {
      (function(i) {
        setTimeout(() => {
          if (i === total) {
            resolve();
            res.end();
          } else {
            res.write(`${i}<br>`);
          }
        }, i * 1000);
      })(i);
      i++;
    }
  });
});

app.listen(PORT);
console.info(`server started at http://localhost:${PORT}`);
```

运行效果：

![Koa 中实现 chunked 响应的运行效果](https://user-images.githubusercontent.com/3783096/58687795-3f8c7680-83b5-11e9-880d-83b50889a92d.gif)
<p align="center">Koa 中实现 chunked 响应的运行效果</p>

如你所见，Koa 中的这个实现会在调用 `ctx.res.end()` 后将本来应该在页面内容中处于最顶部的内容，移动到最底部。不解。

或者通过 curl 在命令行中查看效果：

```sh
$ curl -N http://localhost:3000
```

![命令行中接收 chunked 数据的效果](https://user-images.githubusercontent.com/3783096/59296769-51c1bb00-8cb9-11e9-9c6b-78768ea68f36.gif)
<p align="center">命令行中接收 chunked 数据的效果</p>

示例代码可在 [wayou/koa-chunked-response](https://github.com/wayou/koa-chunked-response) 找到。


## 相关资源

- [wayou/koa-chunked-response](https://github.com/wayou/koa-chunked-response)
- [Koa documentation](https://koajs.com)
- [Node.js Docs - response.write(chunk[, encoding][, callback])](https://nodejs.org/api/http.html#http_response_write_chunk_encoding_callback)
- [Node.js Docs - response.end([data][, encoding][, callback])](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback)

    