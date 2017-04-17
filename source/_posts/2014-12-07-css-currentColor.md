title: CSS currentColor 变量的使用
toc: true
categories: 技术
date: 2014-12-07 12:56:22
tags:
- CSS
---

CSS中存在一个神秘的变量，少有人知自然也不怎么为人所用。它就是`crrentColor`变量（或者说是CSS关键字，但我觉得称为变量好理解些）。

<!-- more -->

# 初识

它是何物？具有怎样的功效？它从哪里来？带着这些疑问我们继续。

下面是来自[MDN的解释](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentColor_keyword)：
> `currentColor`代表了当前元素被应用上的`color`颜色值。 使用它可以将当前这个颜色值应用到其他属性上，或者嵌套元素的其他属性上。

你这可以这么理解，CSS里你可以在任何需要写颜色的地方使用`currentColor`这个变量，这个变量的值是当前元素的`color`值。如果当前元素没有在CSS里显示地指定一个`color`值，那它的颜色值就遵从CSS规则，从父级元素继承而来。

到此似乎解决了上面三个哲学式的提问，但依然有些模糊。程序员之间的交流，还是上码才好。

- 场景1

```html
<p>约么？</p>
```
```css
p{
    color: red;
}
```

此时，`<p>`标签`currentColor`的值为`red`。

<br>

- 场景2

```html
<div class="container">
    <p>约么？</p>
</div>
```
```css
.container{
    color: #00ff00;
}
```


现在，我们没有给`<p>`标签指定颜色，它的`color`从父级容器也就是`class`为`container`的`div`继承而来，换句话说此时`p`标签的`color`为`#00ff00`，`currentColor`又是直接去取元素的`color`值，所以此时`p`标签的`currentColor`值也为`#00ff00`。

![situation2](/asset/posts/2014-12-07-css-currentColor/situation2.jpg)

- 场景3

如果父级元素也没有写`color`呢？其实这里都还是CSS规则的范畴，跟本文的主角关系不太大。但本着不啰嗦会死的原则，就展开了讲。

如果父级元素也没有指定颜色，那它的父级元素就会从父级的父级去继承，直到文档的根结点`html`标签都还没显示指定一个颜色呢，就应用上浏览器默认的颜色呗~

```html
<!doctype html>
<html>
    <head>
        <title>我来组成头部</title>
    </head>
    <body>
        <p>约么？</p>
    </body>
    <footer>战神金钢，宇宙的保护神！</footer>
</html>
```
```css
/**
 * 无CSS
 */
```

![situation3](/asset/posts/2014-12-07-css-currentColor/situation3.jpg)

那，这个时候的黑色其实是浏览器默认给的。此时`p`标签的`currentColor`自然也跟`color`值一样，为黑色，纯黑的`#000`。

# 如何用？

了解它是怎样的物品后，下面问题来了，如何用？有额外的`buff`效果么，耗蓝多么，CD时间长么。。。

前面说道，它就是一个CSS变量，存储了颜色值，这个值来自当前元素的`color`CSS属性。当你需要为该元素其他属性指定颜色的时候，它就可以登上舞台了。

```html
<div class="container">
    好好说话，有话好好说
</div>
```
```css
.container{
    color: #3CAADB;
    border: 4px solid currentColor;
}
```

<pre class="_cssdeck_embed" data-pane="output" data-user="wayou" data-href="wkwhomt3" data-version="0"></pre><script async src="http://cssdeck.com/assets/js/embed.js"></script>

这里我们第一次领略了`currentColor`的奇效。在指定边框颜色的时候，我们直接使用`currentColor`变量，而没有写一个传统的颜色值。

你似乎也知道了该如何用了。不只是`border`，其他能够使用颜色的地方，比如`background`，`box-shadow`等等。

# 带你装逼带你飞

新技能就是如此炫酷。大开脑洞任性地去使用吧！

## 与渐变混搭
你可能无法想象到的是，除了可以将`currentColor`用到普通需要颜色的场景，它同样可以被用在渐变中。

```html
<div class="container">
</div>
```

```css
.container{
  height:200px;
  color: #3CAADB;
  background-image: linear-gradient(to right, #fff, currentColor 100%);
}
```
<pre class="_cssdeck_embed" data-pane="output" data-user="wayou" data-href="igvks1h5" data-version="0"></pre><script async src="http://cssdeck.com/assets/js/embed.js"></script>

甚至也可用于填充svg，下面会有相应示例。

## 与CSS动画结合

当与CSS `animation`结合，可以得到更加有创意的效果，比如[这个来自codepen的示例](http://codepen.io/scottkellum/pen/Fhxql)

<p data-height="268" data-theme-id="2997" data-slug-hash="Fhxql" data-default-tab="result" data-user="scottkellum" class='codepen'>See the Pen <a href='http://codepen.io/scottkellum/pen/Fhxql/'>currentColor</a> by Scott Kellum (<a href='http://codepen.io/scottkellum'>@scottkellum</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## 更加简洁的CSS

其实，新技能不只是装逼那么单纯，合理的使用`currentColor` 变量会让你的CSS代码变得简洁。这才是我们想要达到的目的。以炫技为目的技能是没有生产意义的。

看下面这个例子（这个示例灵感来自[这里](http://osvaldas.info/keeping-css-short-with-currentcolor)）

![btn_with_svg_st](/asset/posts/2014-12-07-css-currentColor/btn_with_svg_st.jpg)

我们在按钮中使用了一个svg图标。你是一个负责任的FE，所以，对这个按钮的各种状态`:focus`，`:hover`，`:active`都作了样式上的处理。同时，为了让图标也跟着保持一致的姿态变更，需要把对`<a>`标签的样式处理同样就到到`<svg>`标签上。于是你的CSS代码看起来就是下面这样的了。


```css
/*a 标签*/
.button {
    color: #117B6F;
    font-size: 1.2em;
}
.button:hover, .button:focus {
    color: #01B19A;
}
.button:active {
    color: #02D7BB;
}

/*svg 标签*/
.button svg {
    height: 17px;
    width: 17px;
    fill: #117B6F;
}
.button:hover svg, .button:focus svg {
    fill: #01B19A;
}
.button:active svg {
    fill: #02D7BB;
}
```

<pre class="_cssdeck_embed" data-pane="output" data-user="wayou" data-href="smxdd6mn" data-version="0"></pre><script async src="http://cssdeck.com/assets/js/embed.js"></script>

你也发现了，代码有点冗余。接下来，我们用`currentColor`来将它简化一下。于是成了下面这样：

```css
/*a 标签*/
.button {
    color: #117B6F;
    font-size: 1.2em;
}
.button:hover, .button:focus {
    color: #01B19A;
}
.button:active {
    color: #02D7BB;
}

/*svg 标签*/
.button svg {
    height: 17px;
    width: 17px;
    fill: currentColor;
}
```

<pre class="_cssdeck_embed" data-pane="output" data-user="wayou" data-href="oxuuu1ex" data-version="0"></pre><script async src="http://cssdeck.com/assets/js/embed.js"></script>

## 更好维护的CSS

仔细想想不难发现，当使用`currentColor`后，我们的CSS也变得更加好维护了。

还拿上面的按钮示例来说，优化之前不但代码冗余，而且哪天PM来劲了说这颜色饱看，给换个其他色。于是你得把`<a>`标签和`<svg>`一起换了。

但优化后就不一样了，因为`<svg>`使用的填充是`currentColor`，你只需要改变`<a>`标签的颜色，它也就跟着变了。真正做到了牵一发而不动全身。这不正是众码友们毕生所追求的理想编程境界么。


# 浏览器兼容性

一提到浏览器兼容性，FE同学们或许就不敢那么任性了。之前你可能是这样的：

![before](/asset/posts/2014-12-07-css-currentColor/before.gif)

当听到IE传来的噩耗，你可能是这样的：

![after](/asset/posts/2014-12-07-css-currentColor/after.gif)

经查，[can i use](http://caniuse.com/#search=currentcolor) 没有关于它的数据。

经测，
- 本机Win7搭载的IE8不支持
- 本机安装的火狐31发来战报表示支持
- Chrome，你猜？
- 本机Safari 5.1.7也表示支持
- 本机Opera 26 同样表示支持

根据[这篇文章](http://demosthenes.info/blog/908/The-First-CSS-Variable-currentColor)的描述，它是可以很好地工作在在所有现代浏览器和IE9+上的，甚至是各浏览器对应的移动版本。所以，在IE不是主要客户对象的情况下，还是可以放心使用的。

# 参考

- [css-tricks currentColor](http://css-tricks.com/currentcolor/)
- [Keeping CSS short with currentColor](http://osvaldas.info/keeping-css-short-with-currentcolor)
- [The First CSS Variable: currentColor](http://demosthenes.info/blog/908/The-First-CSS-Variable-currentColor)

