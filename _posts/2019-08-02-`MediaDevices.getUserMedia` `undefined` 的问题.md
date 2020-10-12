---
layout: post
title: "`MediaDevices.getUserMedia` `undefined` 的问题"
date: 2019-08-02 23:08:00 +0800
tags: 
---
    
# `MediaDevices.getUserMedia` `undefined` 的问题

通过 [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) 获取用户多媒体权限时，需要注意其只工作于以下三种环境：

- `localhost` 域
- 开启了 HTTPS 的域
- 使用 `file:///` 协议打开的本地文件

其他情况下，比如在一个 `HTTP` 站点上，`navigator.mediaDevices` 的值为 `undefined`。

如果想要 `HTTP` 环境下也能使用和调试 `MediaDevices.getUserMedia()`，可通过开启 Chrome 的相应参数。

### 通过相应参数启动 Chrome

传递相应参数来启动 Chrome，以 `http://example.com` 为例，

```sh
 --unsafely-treat-insecure-origin-as-secure="http://example.com"
```

### 开启相应 flag

通过传递相应参数来启动 Chrome `Insecure origins treated as secure` flag 并填入相应白名单。

- 打开 `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
- 将该 flag 切换成 `enable` 状态
- 输入框中填写需要开启的域名，譬如 `http://example.com"`，多个以逗号分隔。
- 重启后生效。


## 相关资源

- [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [getUserMedia() in chrome 47 without using https](https://stackoverflow.com/a/34198101/1553656)
    