title: HTML5 <details> 标签
toc: true
categories: 技术
date: 2014-11-30 12:54:43
tags:
- html5
---

HTML5 中新增的`<details>`标签允许用户创建一个可展开折叠的元件，让一段文字或标题包含一些隐藏的信息。

<!-- more -->

# 用法

一般情况下，`details`用来对显示在页面的内容做进一步骤解释。其展现出来的效果和jQuery手风琴插件差不多。

其大致写法如下：

```html
<details>
    <summary>Google Nexus 6</summary>
    <p>商品详情：</p>
    <dl>
        <dt>屏幕</dt>
        <dd>5.96” 2560x1440 QHD AMOLED display (493 ppi)</dd>
        <dt>电池</dt>
        <dd>3220 mAh</dd>
        <dt>相机</dt>
        <dd>13MP rear-facing with optical image stabilization 2MP front-facing</dd>
        <dt>处理器</dt>
        <dd>Qualcomm® Snapdragon™ 805 processor</dd>
    </dl>
</details>
```

首先是`<details>`标签，里面接着是标题`<summary>`，这里面的内容一般简短，具有总结性，会展示在页面。接着可以跟任意类型的HTML元素作为详情内容，这些内容需要在点击`<summary>`才会呈现。

上面代码呈现出来的效果会是下面这样的：

![html5 details tag](/asset/posts/2014-11-30-html5-details-tag/html5_details_tag.gif)


最开始详情是隐藏的，当点击时都会展现。

## open 属性

当然，你也可以通过给`<details>`标签设置`open`属性让它默认为展开状态。

```html
<details open>
    <summary>Google Nexus 6</summary>
    <p>商品详情：</p>
    <dl>
        <dt>屏幕</dt>
        <dd>5.96” 2560x1440 QHD AMOLED display (493 ppi)</dd>
        <dt>电池</dt>
        <dd>3220 mAh</dd>
        <dt>相机</dt>
        <dd>13MP rear-facing with optical image stabilization 2MP front-facing</dd>
        <dt>处理器</dt>
        <dd>Qualcomm® Snapdragon™ 805 processor</dd>
    </dl>
</details>
```

此时默认会把详情展开，而点击标题后会折叠起来。

# 示例

示例如上面那样，预览在线版本可[点击此处](http://sandbox.runjs.cn/show/hjotymth)。


# 浏览器兼容性

由于是HTML5新标签，浏览器支持情况不是很理想。从来自[caniuse](http://caniuse.com/#feat=details)的数据来看，目前仅Chrome, Safari 8+ 和Opera 26+支持此标签。

可喜的是，如果你在caniuse开启了「显示来自UC浏览器的结果」 选项的话，会发现，国产的UC浏览器也支持了此标签。

![can i use details tag](/asset/posts/2014-11-30-html5-details-tag/browser_compatability.jpg)

# Polyfill

既然支持情况如此不理解，那么使用垫片（polyfill）就很有必要了。

垫片就是在那些不支持此特性的浏览器上使用JavaScript来手动模拟，看起来好像是浏览器支持了一样。

[chemerisuk](http://www.smashingmagazine.com/author/maksim-chemerisuk/?rel=author)给出了他的一个实现，源码在[GitHub上](https://github.com/chemerisuk/better-
[details-polyfill)，具体的实现思路也写成了博文发到了[Smashing Magazine](http://www.smashingmagazine.com/2014/11/28/complete-polyfill-html5-details-element/)，用法可参见GitHub。


# 参考

- [HTML &lt;details&gt; Tag](http://www.w3schools.com/tags/tag_details.asp)
- [HTML &lt;dt&gt; Tag](http://www.w3schools.com/tags/tag_dt.asp)
- [Making A Complete Polyfill For The HTML5 Details Element](http://www.smashingmagazine.com/2014/11/28/complete-polyfill-html5-details-element/)
- [better-details-polyfill](https://github.com/chemerisuk/better-details-polyfill)