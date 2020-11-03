---
layout: post
title: Chrome Devtools 调试时屏蔽库文件
date: 2020-11-03T14:43:09Z
---
# Chrome Devtools 调试时屏蔽库文件

断点调试时屏幕掉三方库文件会使得调用堆栈简洁很多，只包含自己的代码，方便快速定位。

操作方式是，

在断点的 stack 列表上，对需要进行屏蔽的文件右键，选择 “Blackbox scripts”

![image](https://user-images.githubusercontent.com/3783096/96577499-48614d80-1306-11eb-8856-331bc3af4517.png)


点击 “Show blackboxed frames” 可恢复其显示。

