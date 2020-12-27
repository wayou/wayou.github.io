---
layout: post
title: "`noopener`, `noreferrer` 及 `nofollow` 的用法"
date: 2020-12-25T13:23:31Z
---
# `noopener`, `noreferrer` 及 `nofollow` 的用法

`<a>` 标签通常会配合着使用 `noopener`, `noreferrer` 及 `nofollow` 这些属性, 它们的作用及用法如下。

## `noopener`

当给链接加上 `target="_blank"` 后， 目标网页会在新的标签页中打开， 此时在新打开的页面中可通过 `window.opener` 获取到源页面的 `window` 对象， 这就埋下了安全隐患。

具体来说,

- 你自己的网页 A 有个链接是打开另外一个三方地址 B
- B 网页通过 `window.opener` 获取到 A 网页的 `window` 对象， 进而可以使得 A 页面跳转到一个钓鱼页面 `window.opener.location.href ="abc.com"`， 用户没注意地址发生了跳转， 在该页面输入了用户名密码后则发生信息泄露

为了避免上述问题， 引入了 `rel="noopener"` 属性， 这样新打开的页面便获取不到来源页面的 `window` 对象了， 此时 `window.opener` 的值是 `null`。

所以， 如果要在新标签页中打开三方地址时， 最好配全着 `rel="noopener"`。

## `noreferrer`

与 `noopener` 类似， 设置了 `rel="noreferrer"` 后新开页面也无法获取来源页面的 `window` 以进行攻击， 同时， 新开页面中还无法获取 `document.referrer` 信息， 该信息包含了来源页面的地址。

通常 `noopener` 和 `noreferrer` 会同时设置， `rel="noopener noreferrer"`。

既然后者同时拥有前者限制获取  `window.opener` 的功能， 为何还要同时设置两者呢。

考虑到兼容性， 因为一些老旧浏览器不支持 `noopener`。

## `nofollow`

搜索引擎对页面的权重计算中包含一项页面引用数 (backlinks), 即如果页面被其他地方链接得多， 那本页面会被搜索引擎判定为优质页面， 在搜索结果中排名会上升。

当设置 `rel="nofollow"` 则表示告诉搜索引擎， 本次链接不为上述排名作贡献。

一般用于链接内部地址， 或一些不太优质的页面。

## 相关资源

- [Prevent Reverse Tabnabbing Attacks With Proper noopener, noreferrer, and nofollow Attribution](https://blog.bhanuteja.dev/noopener-noreferrer-and-nofollow-when-to-use-them-how-can-these-prevent-phishing-attacks)

