---
layout: post
title: "HTML `capture` 属性"
date: 2019-06-16 10:06:00 +0800
tags: 
---
    
# HTML `capture` 属性

`file` 类型的 `<input>` 除了调起系统的文件选择框外，还可通过指定 `capture` 属性来现场拍照或录制。配合 `accept` 属性，可实现更加便捷的文件获取。

比如想要录制一段视频，可以这么写：

```html
<input type="file" accept="video/*" capture />
```

点击之后直接打开摄像头进行拍摄，而不是弹起文件选择。

![`capture` 属性演示](https://user-images.githubusercontent.com/3783096/59446364-f405ae00-8e33-11e9-8614-f626d383f63a.gif)
<p align="center">`capture` 属性演示</p>

如果没有这个 `capture` 属性，则需要先借助 [`Media​Devices​.get​User​Media()
`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) 获取用户的相机权限，然后再通过 [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) API 进行录制，处理得到的文件。

同样，对于拍照的情况也非常方便了，可以这么写：

```html
<input type="file" accept="image/*" capture="camera" />
<!-- or -->
<input type="file" accept="image/*;capture=camera"/>
```

更多示例可参见 [W3C 文档中示例部分](https://w3c.github.io/html-media-capture/#examples)。

## 浏览器兼容性

从 [Can I Use - HTML Media Capture](https://caniuse.com/#feat=html-media-capture) 的统计来看，支持得还不是很好。但尝试后发现 iOS 只能录制视频，即使指定 `accept="audio/*"` 也是调起视频录制，而不是录音。


## 相关资源

- [w3c/html-media-capture](https://github.com/w3c/html-media-capture/)
- [W3C - HTML Media Capture](https://www.w3.org/TR/html-media-capture/)
- [Can I Use - HTML Media Capture](https://caniuse.com/#feat=html-media-capture)
- [Capturing Audio & Video in HTML5](https://www.html5rocks.com/en/tutorials/getusermedia/intro/)
- [HTML file input control with capture and accept attributes works wrong?](https://stackoverflow.com/questions/21523544/html-file-input-control-with-capture-and-accept-attributes-works-wrong)
    