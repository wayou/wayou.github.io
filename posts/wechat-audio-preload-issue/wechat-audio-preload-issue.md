iOS 微信中音频 preload 的问题
===

微信中 audio `preload` 并不好用，不确定是新版本中 x5 浏览器内核有变更的原因。

一般情况下，如果想要展示音频的时长，只需要设置 `preload=‘metadata’` 即可。 

```js
var player = new Audio(url);
  player.preload = "metadata";
  player.onloadedmetadata = () => {
    duration.textContent = player.duration;
  };
```

微信中不生效。解决办法是添加微信的 web sdk，然后监听 `WeixinJSBridgeReady` 事件，在该事件的回调中手动调用 `load` 即可。

```js
document.addEventListener(
    "WeixinJSBridgeReady",
    function() {
      player.load();
    },
    false
  );
```

对于视频同理。通过在 `WeixinJSBridgeReady` 回调中手动调用 `load` 可预加载资源视频可通过该方法加载出第一帧作为封面。

如果要实现自动播放，iOS 及微信中也是限制很多。通过上述方法，只需将 `load` 换成 `play` 即可。

[点击此处查看示例](https://wayou.github.io/posts/wechat-audio-preload-issue/index.html)

