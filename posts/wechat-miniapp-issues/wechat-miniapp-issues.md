微信小程序问题集锦
===

### #<span>0 Canvas 绘制不生效 

原因有可能是 canvas context 的创建方式不对。

通过 `wx.createCanvasContext(canvasId, this)` 创建 canvas 绘图上下文时，第后个参数是指自定义组件的实例。如果 canvas 位于自定义组件中，这个参数是必传的，否则绘制不生效，界面没显示任何东西。

来看官方文档关于 [wx.createCanvasContext](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/create-canvas-context.html) 的介绍：

> 自定义组件实例 this ，表示在这个自定义组件下查找拥有 canvas-id 的 <canvas/> ，**如果省略，则不在任何自定义组件内查找**

*components/paint.json*
```json
{
    "component": true
}
```
<br>

*components/paint.js*
```js
Component({
  ready: function() {
    const ctx = wx.createCanvasContext("myCanvas", this /* 它很重要 */);

    ctx.setFontSize(20);
    ctx.fillText("Hello", 20, 20);
    ctx.fillText("MINA", 100, 100);

    ctx.draw();
  }
});
```


### #<span>1  Canvas API 与 DOM 中不一样

部分 API 与 DOM 中 canvas 有差异，体现在方法名与参数上。

比如 ：

`context.createRadialGradient(x0, y0, r0, x1, y1, r1);`, 

微信中我能找到对应的，至少从名称上来看，应该是 `context.createCircularGradient(x,y,r)`


该 API 创建放射状的渐变，渐变由两个圓形边界确定。微信小程序中提供的对应 API 少了一个圆，一如文档中所说，起点从圆心开始。可以理解为缺少的那组参数所确定的圆，其圆心与外围圆心一致，只是半径为0。

像这种不与我们所熟知的 API 靠拢，进而设计出相近参数不同的 API，不太明白其用意和初衷。只是我们在写码时需要勤看文档，否则会困绕很久。

```js
Component({
  ready: function() {
    const ctx = wx.createCanvasContext("myCanvas");

    // const grd = ctx.createRadialGradient(0, 0, 50, 75, 50, 50);
    const grd = ctx.createCircularGradient(75, 50, 50);

    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    ctx.setFillStyle(grd);
    ctx.fillRect(10, 10, 150, 80);
    ctx.draw();
  }
});
```



### #<span>2 真机上图片绘制不生效

与 DOM 中 canvas 的图片绘制不同，小程序提供于向画布绘制图片的 API `canvasContext.drawImage` 其所需的图片资源为图片的地址。

特别地，如果发现绘制后没展示，多半是因为绘制的图片来自远端，需要使用先下载到本地。这其实跟原生 DOM canvas 绘制网络图片时一样，先 `new Image()` 等加载完后在 `img.onload` 回调中再绘制。

```js
wx.downloadFile({
    url: 'https://example.com/foo.jpg',
    success: function (res) {
        const ctx = wx.createCanvasContext('myCanvas')
        ctx.drawImage(res.tempFilePath, 0, 0, 150, 100)
        ctx.draw()
    }
})
```

因为小程序内对外部资源的使用的严格限制，这里使用 `wx.downloadFile` API 下载的图片地址需要添加到 `downloadFile 合法域名` 中。