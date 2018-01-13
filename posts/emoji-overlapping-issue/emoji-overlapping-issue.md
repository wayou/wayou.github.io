## Emoji 与文本重叠的问题


### 长话短说

网页中 emoji 表情与文字的混排，正在来说没问题，但当你使用扩展屏幕的时候，并且扩展屏分辨率不够的情况下，会出现表情与文字重叠的情况。

![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/emoji-overlap-issue.jpg)

算问题，也不算问题，毕竟正常使用没问题。

### 让我们去探索一下原因

一开始以为是样式代码写得有问题。

为了证明这不是我们代码的问题，我们拿其他网站来试一试，譬如对于排版有卓越追求的Medium，我随便找了篇 [文章](https://medium.com/@nodejs/fireside-chat-with-node-js-foundation-chairperson-todd-moore-vp-of-open-technology-at-ibm-cfb5a337a4fa
)，流利地插入了一把金钥匙🔑外带两个笑脸。

![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/extend-display.png)
*主显示器*


![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/normal-display.png)
*扩展显示器*


重叠还是迷一样的存在着，特别是钥匙这个表情，特别明显，因为它是倾斜的，像一把刺刀，直插隔壁的老王。

为了排除浏览器外的样式带来的影响，我们做个实验。

在浏览器地址栏输入以下内容打开一个纯净而不沾淤泥的 html

```
data:text/html, <html contenteditable>
```

然后粘入测试文本。

```
🔑H😒😒is first foray into computing was wire wrapping a Fairchild SCMP chipset into a simple computer and then doing the same with a Zilog Z80. Building his own first computer and then teaching himself to program set him on a path to a career in the industry. 
```

chrome 中：

![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/chrome-plain-html-normal-display.png)
*主显示器*

![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/chrome-plain-html-extend-display.png)
*扩展显示器*

问题依旧，but，到这里我想到一点。不防多走一步，其他浏览器里面也试试。

Safari 下：

![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/safari-plain-html-normal-display.png)
*主显示器*

![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/safari-plain-html-extend-display.png)
*扩展显示器*


firefox 下：

![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/firefox-plain-html-normal-display.png)
*主显示器*

![主显示器](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/firefox-plain-html-extend-display.png)
*扩展显示器*

不对比不知道，一对比真有料！

从上面的对比结果来看，Chrome 中重叠的问题很明显，且只有 chrome 在扩展屏中展示有重叠问题，其他浏览器没问题，这不得不让人怀疑 chrome 渲染有问题丫。

于是，果断给 Chromium file了个 bug 先 。

[Issue 784780](https://bugs.chromium.org/p/chromium/issues/detail?id=784780&can=4&q=&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified)

那么问题来了，前端能做什么呢。

### 如果在前端兼容呢？

如果能在内容生成阶段进行控制，那就好办了，可以将 emoji 包一层 `span` 标签，然后就可以随意写样式了，就可以手动给表情加上边距。

但真实情况下 emoji 与文本是一体的，并不好单独抽离出来。如果不能再内容产生的地方进行控制，那就只能在拿到内容后进行处理。

### emoji 的检测

基本上，表情也是字符，可以用正则像匹配一般字符那样用 ASCII 值去匹配。
但事物总是发展变化的，不断有新的表情加入到表情包中，也就是说表情的 ASCII 值并没有一个固定的范围。目前尚没有任何官方组织或者机构宣称一套可信的范围。

通过以下的正则，能够匹配大部分已被发现的 emoji。

```
(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])
```

[这篇文章](https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb)有专门讨论如何得出以上正则并对以上正则的正确性负责。

测试一波：

```js
$0.innerHTML = $0.textContent.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,function(a){
	return '<span>'+a+'</span>'
})
```

![抽取及处理文件中的表情](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/emoji-overlapping-issue/assets/emoji-abstract.png)
*抽取及处理文件中的表情*

### 相关资源

- [How to detect emoji using javascript](https://stackoverflow.com/a/41164587/1553656)
- [Emojis in Javascript](https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb) 


