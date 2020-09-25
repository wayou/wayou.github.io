---
layout: post
title: "koa-router 路由参数与前端路由的结合"
date: 2019-05-19 22:05:00 +0800
tags: 
---
    
# koa-router 路由参数与前端路由的结合

[koa-router]() 定制路由时支持通过冒号形式在 url 中指定参数，该参数会挂载到 `context` 上然后可通过 `context.params.paramName` 方便地获取。

考察下面的示例：

```js
var Koa = require("koa");
var Router = require("koa-router");

var app = new Koa();
var router = new Router();

router.get("/user/:id", async function(ctx, next) {
  const userId = ctx.params.id;
  ctx.body = `user id is:${userId}`;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

console.log("server started at http:localhost:3000");
```

启动服务后可看到页面中展示出了从 url 中获取到的 id 参数。

![路由参数的获取展示](https://user-images.githubusercontent.com/3783096/57971816-a2e5d400-79c5-11e9-8e74-16a0bccc1560.png)
<p align="center">路由参数的获取展示</p>

现在来考虑另一种情况，即路由中支持前端路由的情况。

即把现在的 url 由 `/user/:id` 的形式扩展成 `/user/:id/foo/bar`，这里 `/foo/bar` 部分可以是任何路由，作为前端处理的路由部分。

为了实现这样的前端路由部分，服务端路由的配置需要借助正则来进行，

```diff
- router.get("/user/:id", async function(ctx, next) {
+ router.get(["/user/:id", /\/user\/([\w|\d]+)\/.*/], async function(ctx, next) {
  const userId = ctx.params.id;
  ctx.body = `user id is:${userId}`;
});
```

这里将路由中 url 由单个字符串变成了数组形式，第一个还是原来的路由，这样正常的通过 `/user/1` 形式过来的页面能命中该路由。同时添加 `/\/user\/([\w|\d]+)\/.*/` 部分，因为正则情况下不再支持路由中通过冒号进行参数的配置，所以这里 `/user/` 后跟随的 id 也需要使用正则来替换掉。

但正则匹配下的路由就不能通过 `context.params` 来访问 url 上的参数了。不过好在可通过在正则中定义匹配组（Capturing Groups）的形式来定义参数，即其中 `([\w|\d]+)` 括号包裹的部分，称为一个匹配组，一个匹配组是会自动被挂载到 `context.params` 上的，只是不像通过冒号定义的参数那样会有一个名字，这种形式的参数按照匹配到的顺序形成一个数组赋值到 `context.params`，所以访问第一个匹配组形成的参数可通过 `context.params[0]` 来获取。

于是上面的代码稍加修正后，就能够正确处理来自命名参数（通过冒号匹配）或正则参数形成的 query 参数了。

```diff
- router.get("/user/:id", async function(ctx, next) {
+ router.get(["/user/:id", /\/user\/([\w|\d]+)\/.*/], async function(ctx, next) {
-  const userId = ctx.params.id;
+  const userId = ctx.params.id || ctx.params[0];
  ctx.body = `user id is:${userId}`;
});
```

最后完整的代码会是这样：

```js
var Koa = require("koa");
var Router = require("koa-router");

var app = new Koa();
var router = new Router();

router.get(["/user/:id", /\/user\/([\w|\d]+)\/.*/], async function(ctx, next) {
  const userId = ctx.params.id || ctx.params[0];
  ctx.body = `user id is:${userId}`;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

console.log("server started at http:localhost:3000");
```

此时访问以下连接进行测试，

- [http://localhost:3000/user/1](http://localhost:3000/user/1)
- [http://localhost:3000/user/2/foo](http://localhost:3000/user/2/foo)
- [http://localhost:3000/user/3/foo/bar](http://localhost:3000/user/3/foo/bar)

均能正确命中页面并成功获取到路由中的参数。

![正则路由及路由参数的获取](https://user-images.githubusercontent.com/3783096/57971813-9bbec600-79c5-11e9-9958-70a3a3065d66.gif)
<p align="center">正则路由及路由参数的获取</p>

    