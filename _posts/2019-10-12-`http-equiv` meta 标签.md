---
layout: post
title: "`http-equiv` meta 标签"
date: 2019-10-12 22:10:00 +0800
tags: 
---
    
# `http-equiv` meta 标签

来看以下有趣的代码，

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="refresh" content="1" />
    <title>refresh every 1 s</title>
  </head>
  <body>
    <script>
      document.write(new Date())
    </script>
  </body>
</html>
```

将其保存成 HTML 文件用浏览器打开后，页面每隔 1 秒自动刷新。

这里使其进行刷新操作的是 `http-equiv="refresh" ` meta 标签。

```html
<meta http-equiv="refresh" content="1" />
```

那么什么是 `http-equiv` meta 标签具体是什么，还有哪些有用的值。

## `<meta>` 标签

首先 [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) 标签用来表示其他元素（譬如 `<base>`, `<link>`, `<script>`, `<style>`, `<title>`）无法呈现的网页元数据，其身上可使用的属性有：

- `charset`：指定页面编码，值可以是任意合法的 [标准 IANA MIME 字符编码名称](https://www.iana.org/assignments/character-sets/character-sets.xhtml)
- `content`：包含 `http-equiv` 的值。
- `http-equiv`：其定义的字段相当于同名的 http header。不过并不能通过它定义所有的响应头，只包含以下这些：
    - `content-language` 已废弃
    - `content-security-policy` 
    - `content-type` 已废弃
    - `refresh` 
    - `set-cookie` 已废弃
- `name`：通过 name 定义一些常用的元数据值，比如 `viewport`，`robots`，`creator` 等。
- `scheme`：已废弃

## `http-equiv`

如上，[`http-equiv`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) 只是 `<meta>` 标签的一种属性，与同名 http 响应头功能一样。

最典型的，[CSP（Content Security Policy）](https://github.com/wayou/wayou.github.io/issues/27) 除了可通过在响应头中进行配置外，另一种方式便是使用 `http-equiv` meta 标签，譬如：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

等价于：

```
Content-Security-Policy: default-src 'self';
```

表示网页只信任并加载同域资源。


## 相关资源

- [MDN - \<meta\>: The Document-level Metadata element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv)
    