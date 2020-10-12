---
layout: post
title: "JavaScript 实现页面中录音功能"
date: 2019-06-04 02:06:00 +0800
tags: 
---
    
# JavaScript 实现页面中录音功能

页面中实现录音需要使用浏览器提供的 [Media​Recorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) API，所以前提是需要浏览器支持 [MediaStream Recording](https://w3c.github.io/mediacapture-record/#MediaRecorderAPI) 相关的功能。

以下代码默认工作在 Chrome 环境中。

## 准备页面

首先准备一个页面，其中内容很简单，一个录音按钮，一个用于播放的 `<audio>` 标签。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>audio record</title>
</head>
<body>
    <div class="app">
        <button class="record-btn">record</button>
        <audio controls class="audio-player"></audio>
    </div>
    <script src="./recorder.js"></script>
</body>
</html>
```

## 获取录音权限

因为录音需要使用设备的话筒，所以第一步应该是向用户索要录音的权限。这是通过 [`Media​Devices​.get​User​Media()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) 来完成的，其用法为：

```js
var promise = navigator.mediaDevices.getUserMedia(constraints);
```

其中 [`constraints`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters) 为需要获取的权限列表，这里只需要指定音频 `audio` 即可。

其返回是个 Promise，因为用户何时进行授权是不确定的。通过在 Promise 的回调中进行授权成功或失败的处理。

在使用前需要判断浏览器是否已经支持相应的 API，此时得到如下的代码：

```js
if (navigator.mediaDevices.getUserMedia) {
  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then(
    stream => {
      console.log("授权成功！");
    },
    () => {
      console.error("授权失败！");
    }
  );
} else {
  console.error("浏览器不支持 getUserMedia");
}
```

其中成功回调里得到的入参 `stream` 为 [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) 对象。

此时运行后可看到浏览器展示出了让用户授权使用麦克风的提示。

![向用户索要麦克风使用权限](https://user-images.githubusercontent.com/3783096/58750750-a484c100-84c8-11e9-9785-94746d98dbd5.png)
<p align="center">向用户索要麦克风使用权限</p>

## 创建录音实例

将上一步获取到的 [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) 传入 [Media​Recorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) 的构造器创建一个录音器的实例。

```js
var mediaRecorder = new MediaRecorder(stream);
```

## 启动录音

通过监听页面中录音按钮的点击来启动录音。

```js
const recordBtn = document.querySelector(".record-btn");
const mediaRecorder = new MediaRecorder(stream);
recordBtn.onclick = () => {
  mediaRecorder.start();
  console.log("录音中...");
};
```

`MediaRecorder` 实例上有个 [`state`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/state) 状态，可用来判断录音器当前的活动状态，总共有三种值：

- `inactive`：处于休息状态，要么是没开始，要么是开始后已经停止。
- `recording`：录音中
- `paused`：已经开始，但被暂停了，不是停止也没有被恢复。

所以通过这个状态，我们可以实现再次点击按钮时，结束录音。

```js
recordBtn.onclick = () => {
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordBtn.textContent = "record";
    console.log("录音结束");
  } else {
    mediaRecorder.start();
    console.log("录音中...");
    recordBtn.textContent = "stop";
  }
  console.log("录音器状态：", mediaRecorder.state);
};
```

## 音频数据的获取

上面按钮处理来自用户的交互，只负责启动或停止录音。音频的数据还是从 [Media​Recorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) 实例上通过监听其相应的事件来完成的。

当录音开始时，会触发其 [`MediaRecorder.ondataavailable`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/ondataavailable) 事件，从该事件回调的入参为 [`BlobEvent`](https://developer.mozilla.org/en-US/docs/Web/API/BlobEvent)，从它身上取到 [`event.data`](https://developer.mozilla.org/en-US/docs/Web/API/BlobEvent/data) 便是我们需要的音频数据。因为数据是一段一段产生的，所以需要暂存到一个数组中。

```js
const chunks = [];
mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};
```

目前为止完成的代码应该是这样的：

<details>
<summary>
recorder.js
</summary>

```js
const recordBtn = document.querySelector(".record-btn");
const playBtn = document.querySelector(".play-btn");

if (navigator.mediaDevices.getUserMedia) {
  var chunks = [];
  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then(
    stream => {
      console.log("授权成功！");

      const mediaRecorder = new MediaRecorder(stream);

      recordBtn.onclick = () => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          recordBtn.textContent = "record";
          console.log("录音结束");
        } else {
          mediaRecorder.start();
          console.log("录音中...");
          recordBtn.textContent = "stop";
        }
        console.log("录音器状态：", mediaRecorder.state);
      };

      mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
      };
    },
    () => {
      console.error("授权失败！");
    }
  );
} else {
  console.error("浏览器不支持 getUserMedia");
}
```

</details>

![录音状态的查看](https://user-images.githubusercontent.com/3783096/58750759-c0886280-84c8-11e9-9c8f-154a1fafc959.gif)
<p align="center">录音状态的查看</p>


## 录音结束及音频的播放

通过监听 [`MediaRecorder.onstop`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/onstop) 事件，将收集好的音频数据创建成 [Blob 对象](https://developer.mozilla.org/en/docs/Web/API/Blob)，然后 通过 [`URL.createObjectURL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) 创建成 HTML 中 `<audio>` 标签可使用的资源链接。

```js
mediaRecorder.onstop = e => {
  var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  chunks = [];
  var audioURL = window.URL.createObjectURL(blob);
  audio.src = audioURL;
};
```

其中，在使用完收到到的音频数据后，将 `chunks` 置空方便下次录音时使用。

目前为止完成的代码应该是这样的：

<details>
<summary>
recorder.js
</summary>

```js
const recordBtn = document.querySelector(".record-btn");
const player = document.querySelector(".audio-player");

if (navigator.mediaDevices.getUserMedia) {
  var chunks = [];
  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then(
    stream => {
      console.log("授权成功！");

      const mediaRecorder = new MediaRecorder(stream);

      recordBtn.onclick = () => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          recordBtn.textContent = "record";
          console.log("录音结束");
        } else {
          mediaRecorder.start();
          console.log("录音中...");
          recordBtn.textContent = "stop";
        }
        console.log("录音器状态：", mediaRecorder.state);
      };

      mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = e => {
        var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        var audioURL = window.URL.createObjectURL(blob);
        player.src = audioURL;
      };
    },
    () => {
      console.error("授权失败！");
    }
  );
} else {
  console.error("浏览器不支持 getUserMedia");
}
```

</details>

## 运行

完成上面步骤后，实现了一个简单的录音功能，可通过[此地址](https://wayou.github.io/audio-recorder/index.html)在线体验。完整的代码可在仓库[ wayou/audio-recorder](https://github.com/wayou/audio-recorder) 中获取到。

## 相关资源

- [Media​Recorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [`MediaRecorder.onstop`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/onstop)
- [`URL.createObjectURL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
    