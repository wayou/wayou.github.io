title: 利用HTML5 的Datalist 元素实现输入提示
categories: 技术
toc: true
date: 2014-09-14 14:23:54
tags:
- HTML5
- Datalist
- Autocomplete
- 前端
---

HTML5有无限可能，总是在释出一些新鲜实用的功能，让原生的web环境更加炫酷。

今天看到`datalist` 这个元素，可以用来预先定义一个输入框的潜在选项，也就是我们在平时项目中经常用jQuery插件或者自己写JS来实现的`autocomplete`「自动补全，但似乎自动提示更贴切一些」功能。

<!-- more -->

# datalist 标签

具体来说，页面上的`input`还是原来的`input`，只是在它的下面定义一下新的`datalist`在其中填充触发提示的文本,同时在该`input`元素上指定`list`属性指向这个`list`。一个大概的例子大概是像下面这样：
```html
你最喜欢的浏览器是： <input list="browsers">
<datalist id="browsers">
  <option value="Internet Explorer">
  <option value="Firefox">
  <option value="Chrome">
  <option value="Opera">
  <option value="Safari">
</datalist>
```
最后出来的效果又差不多是这样的：
![HTML5 datalist demo](/asset/posts/2014-09-14-autocomplete-with-html5-datalist/datalist1.gif)

在线查看效果请点击[这里](http://sandbox.runjs.cn/show/lvgpes2k)

没什么特别之处，简单得发指~

但相信大家在看了效果后跟我一样，发现了一个不足之处，在`input`右边会有向下的箭头，这让它看起来就像一个`dropdown` 或者`select` 「下拉框」，解决办法是多加两句CSS代码来将它隐藏，但此方法只是针对`webkit`内核的浏览器进行的优化：

```css
input::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
```

这样之后出来的效果差不多成了这样：
![HTML5 datalist 去掉箭头的版本](/asset/posts/2014-09-14-autocomplete-with-html5-datalist/datalist2.gif)


# 浏览器兼容性

下面的数据来自[caniuse](http://caniuse.com/#feat=datalist)。
![Datalist 元素兼容性](/asset/posts/2014-09-14-autocomplete-with-html5-datalist/caniuse_datalist.jpg)
可以看出，遥遥领先的依然是风采依旧的Chrome，对该元素的支持全线飘绿；
同时Firefox也是毫不示弱，紧随版本帝之后;
而其他浏览器情况则各不相同，正所谓**性**福的人都相似，不幸的人各有不幸。
Opera在边缘浏览器中表现强劲，绿得很耀眼；
值得注意的是，在这场不算较量的较量中，苹果太子Safari则是黑马般拿到了垫底的位置，全线飘红。这直接一举打破IE在主流浏览器的各种评测中常年垫底的记录。
而IE虽然摆脱了末位的阴影，但即使是最新的IE11也只是对`Datalist`元素进行了部分支持，所以要与各强劲对手比肩而受到前端开发者的青睐还有些工作要做。但留给IE翻盘的时间已经不多了，正如留给中国队的时间一样~


# REFERENCE

* [Can I Use Datalist element](http://caniuse.com/#feat=datalist)
* [How to create Autocomplete Textbox using Datalist in HTML5](http://www.codelator.com/blog/2014/sep/how-to-create-autocomplete-textbox-using-datalist-in-html5.html)
