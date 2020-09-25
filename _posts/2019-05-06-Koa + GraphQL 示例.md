---
layout: post
title: "Koa + GraphQL 示例"
date: 2019-05-06 23:05:00 +0800
tags: 
---
    
Koa + GraphQL 示例
===

## 初始化项目

创建 `graphql-example` 文件夹进入后初始化一个 `package.json` 文件。
```sh
$ mkdir graphql-example && cd $_
$ yarn init -y
```

## 安装依赖

使用 [koa-graphql](https://github.com/chentsulin/koa-graphql) 配合 [koa-mount](https://github.com/koajs/mount) 两个 npm 模块来使用 GraphQL。同时需要安装 [graphql](https://www.npmjs.com/package/graphql) 模块来创建需要使用的 schema。

```sh
$ yarn add koa graphql koa-graphql koa-mount
```

## server

安装 `koa` 后，创建 `server.js` 实现一个简单的服务端。

_server.js_
```js
const Koa = require("koa");
const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(3000);
console.log("server started at http://localhost:3000");
```

通过 Node.js 启动后便可访问到页面了。

```sh
$ node server.js
server started at http://localhost:3000
```


## 创建 schema

GraphQL 需要一个 schema 来初始化，创建 `graphql` 目录并在其中创建 `schema.js` 文件，

```sh
$ mkdir graphql
$ touch graphql/schema.js
```

_schema.js_

```js
const { buildSchema } = require('graphql');

const schema = buildSchema(`
 type Query {
   hello: String
 }
`);

module.exports = schema;
```

## 启动 GraphQL 服务

将上面的 schema 传入 `koa-graphql` 然后通过 `koa-mount` 将其作为中间件启动，便可开启 GraphQL 服务。

_server.js_

```js
const Koa = require("koa");
const mount = require("koa-mount");
const graphqlHTTP = require("koa-graphql");
const schema = require("./graphql/schema");

const app = new Koa();

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql: true
    })
  )
);

app.listen(3000);
console.log("server started at http://localhost:3000");
```

再次启动 `server.js` 并访问 [http://localhost:3000/graphql](http://localhost:3000/graphql) 可看到一个可视化的 GraphQL 界面。该界面为 GraphQL 内置的 Graphiql 工具用于查询的调试。

![Graphiql 界面](https://user-images.githubusercontent.com/3783096/57195808-53e17d00-6f89-11e9-97a7-2fa9db585775.png)
<p align="center">Graphiql 界面</p>

## 测试 GraphQL 服务

前面定义的 schema 中包含一个 `hello` 字段，通过在前面的 Graphiql 中编辑查询可请求该字段。

![测试 Query](https://user-images.githubusercontent.com/3783096/57195816-6491f300-6f89-11e9-86ea-b89a54644329.png)
<p align="center">测试 Query</p>

可以看到返回的数据为 `null`，这是因为我们还没有为该字段定义 resolver，即告诉 GraphQL 如何以及从哪里返回该数据。

## 添加 resolver

在 `graphql` 目录创建 `resolver.js` 文件，为 `hello` 字段指定数据的返回逻辑。

_graphql/resolver.js_

```js
module.exports = {
  hello: () => "Hello world!"
};
```

更新我们创建 GraphQL 服务的代码，将 resolver 传入：

_server.js_

```diff
const Koa = require("koa");
const mount = require("koa-mount");
const graphqlHTTP = require("koa-graphql");
const schema = require("./graphql/schema");
+ const root = require("./graphql/resolver");

const app = new Koa();

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema: schema,
+      rootValue: root,
      graphiql: true
    })
  )
);

app.listen(3000);
console.log("server started at http://localhost:3000");
```

再次启动服务并执行查询，能够看到返回了正确的数据。

![返回数据的查询](https://user-images.githubusercontent.com/3783096/57195822-76739600-6f89-11e9-9de9-b9379e880cd3.png)
<p align="center">返回数据的查询</p>

## 相关资源

- [GraphQL Documentation](https://graphql.org/code/#javascript)
- [How to setup a powerful API with GraphQL, Koa and MongoDB](https://medium.freecodecamp.org/how-to-setup-a-powerful-api-with-graphql-koa-and-mongodb-339cfae832a1)
    