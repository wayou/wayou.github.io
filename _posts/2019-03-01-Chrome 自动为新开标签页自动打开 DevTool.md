---
layout: post
title: "Chrome 自动为新开标签页自动打开 DevTool"
date: 2019-03-01 21:03:00 +0800
tags: 
---
    
Chrome 自动为新开标签页自动打开 DevTool
===

有时候需要在页面一开始的地方就进行调试，比如查看网络面板，控制台信息，如果手动打开 DevTool 可能时机会慢了，即使手快使用快捷键 <kbd>command</kbd> + <kbd>shift</kbd> + <kbd>I</kbd> 也并不能做到页面打开时第一时间看到打开 devtool。

可通过命令行启动 Chrome 并带上 `--auto-open-devtools-for-tabs` 参数，这样在新开页面时会自动第一时间打开 DevTool。

通常情况下，加上 `--incognito` 参数打开隐身模式更加符合调试的需要，保证没有其他插件的干扰。

Mac 下使用以下命令：

```sh
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --incognito --auto-open-devtools-for-tabs
```

Windows 下（未测试）：

```sh
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -incognito -auto-open-devtools-for-tabs
```

**需要注意的是，`--auto-open-devtools-for-tabs` 参数只对第一个 Chrome 实例生效，所以需要先关闭已经打开的 Chrome 窗口，即退出  Chrome 后再执行。**

甚至可以在打开时就指定好需要打开的链接。

```sh
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --incognito --auto-open-devtools-for-tabs https://www.baidu.com
```


![自动为 Chrome 新开标签页打开 DevTool](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/auto-open-chrome-dev-tool-for-new-tab/assets/auto_open_chrome_dev_tool_for_new_tab.gif)


### 相关资料

- [Chrome's --auto-open-devtools-for-tabs](https://stackoverflow.com/a/50481022/1553656)
- [Chrome DevTools: Automatically open DevTools in each new tab](https://umaar.com/dev-tips/111-auto-open-devtools/)

    