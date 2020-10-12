---
layout: post
title: "iTerm2 安装 SF Mono 字体"
date: 2020-09-16 23:09:00 +0800
tags: 
---
    
# iTerm2 安装 SF Mono 字体

细看 iTerm2 和 mac 自带的 Terminal 总感觉哪里不对，前者少点灵魂。

最后发现，应该是字体问题，查看 Terminal 所用字体，为 `SF Mono`:

<img width="779" alt="Man Page" src="https://user-images.githubusercontent.com/3783096/93361208-2ee86400-f877-11ea-9eb5-1dd13d72c6e4.png">
<p align="center">mac 自带 Terminal 的设置</p>

这就简单了，但当我准备去 iTerm2 字段设成一样时，发现候选中并没有该字体。

原来该字体为 Terminal 自带，不在系统 字体里。

接下来的工作就是把它复制出来，安装到系统字体中，这样 iTerm2 就能适用上了。

```sh
cd /Applications/Utilities/Terminal.app/Contents/Resources/Fonts/
cp *.otf ~/Library/Fonts/
```

如果发现无法直接 cd 进入 `/Applications/Utilities/Terminal.app/Contents`，可手动去 `/Applications/Utilities/` 找到 Terminal.app，右键 “Show Package Contents”。


## 相关资源

- [iterm2安装 SF Mono 字体](https://gist.github.com/songouyang/ad044926f4db2df83a533766fc701afc)

    