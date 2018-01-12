## CSS 属性的排序

不知道有多少人思考过将 CSS 属性排序的问题。反正在书写网页的无数个日子里，我是有想过这个问题的。
因为大多数时候，调样式写属性完全就是按需要来，调一个加一条，样式调好后，整个元素的样式代码也就确定了。
偶尔会因为美观刻意把自己认为需要提前的属性放到前面一下。
这种下意识的行为让我觉得，冥冥之中，应该有一些可用的约定，指导我们这些纷繁的 CSS 样式属性应该怎样被合理地排列。

著名 CSS 站点 css-tricks 为此专门做了个[问卷调查](https://css-tricks.com/poll-results-how-do-you-order-your-css-properties/)，结果显示：

- 按类型来分组的占 45%
- 完全不 care 这件事，写起来完全随意的占39%
- 按属性字母顺序的占14%
- 最后还有按一行代码长度来排序的占2%


### 我怎么看排序

我认为，让 CSS 属性保持一定的规律有一些好处：
- 作为写程序的人，除了希望代码的输出具有确定性，即每写一行代码我知道我在写什么，我能预知到结果，还希望从代码风格上保持一致，这样在写同类似功能时，写出来的东西是有某种确定性的，代码会有种统一的风格在里面，同时阅读起来会很轻松
- 当这些看似杂乱无序的属性在书写时遵从一定规律后，改起来会很方便。比如我知道长宽属性一般会在一个元素样式的最前面，而动画阴影这些不重要的属性会在靠后的位置
- 会有一种，哲学上的美。写码也是种艺术创作，只不过陈老师用相机，我们用键盘。没有风格的编码是新手，想到哪写到哪，而具有一定风格的代码才是老司机，虽然这种风格不一定普适。


### 盒模型规则的排序

关于 CSS 属性书写时的排序问题，是有一些讨论已经存在的，比如 StackOverflow 上的这个提问[Conventional Order of CSS properties](https://stackoverflow.com/questions/4878655/conventional-order-of-css-properties)，里面有提到一个叫作[The CSS Box Model Convention](https://web.archive.org/web/20130227044124/http://fordinteractive.com/2009/02/order-of-the-day-css-properties/)的约定，该约定里面罗列的顺序是按照 CSS 盒模型来的。

具体来说，可概括为如下的分组顺序：

1. 展示类型及文档流相关/Display & Flow
2. 定位信息/Positioning
3. 元素尺寸/Dimensions
4. 边距边框/Margins, Padding, Borders, Outline
5. 文字排版/Typographic Styles
6. 背景/Backgrounds
7. 其他如透明度，光标样式及衍生内容/Opacity, Cursors, Generated Content

具体到代码则是：

```css
el {
    display: ;
    visibility: ;
    float: ;
    clear: ;
    position: ;
    top: ;
    right: ;
    bottom: ;
    left: ;
    z-index: ;
    width: ;
    min-width: ;
    max-width: ;
    height: ;
    min-height: ;
    max-height: ;
    overflow: ;
    margin: ;
    margin-top: ;
    margin-right: ;
    margin-bottom: ;
    margin-left: ;
    padding: ;
    padding-top: ;
    padding-right: ;
    padding-bottom: ;
    padding-left: ;
    border: ;
    border-top: ;
    border-right: ;
    border-bottom: ;
    border-left: ;
    border-width: ;
    border-top-width: ;
    border-right-width: ;
    border-bottom-width: ;
    border-left-width: ;
    border-style: ;
    border-top-style: ;
    border-right-style: ;
    border-bottom-style: ;
    border-left-style: ;
    border-color: ;
    border-top-color: ;
    border-right-color: ;
    border-bottom-color: ;
    border-left-color: ;
    outline: ;
    list-style: ;
    table-layout: ;
    caption-side: ;
    border-collapse: ;
    border-spacing: ;
    empty-cells: ;
    font: ;
    font-family: ;
    font-size: ;
    line-height: ;
    font-weight: ;
    text-align: ;
    text-indent: ;
    text-transform: ;
    text-decoration: ;
    letter-spacing: ;
    word-spacing: ;
    white-space: ;
    vertical-align: ;
    color: ;
    background: ;
    background-color: ;
    background-image: ;
    background-repeat: ;
    background-position: ;
    opacity: ;
    cursor: ;
    content: ;
    quotes: ;
}
```

### 字母排序

除了上面这个比较知名的规则，还有一种大部分人用的方式则更加简单粗暴，那就是上面问卷结果中有出现的按属性的字母排序（Alphabetical），用的人还不少。这种规则简单明了，写起来也不用多想，个人觉得没多大必要，有点为了排序而排序的感觉，并无多大实用之处。


### 按照重要性的排序/分组

就我个人而言，倾向于将比较重要的常用的放在靠前位置，像元素的长宽`width` `height`这种，影响尺寸，也很直观，我认为是比较重要的属性。其次是`position` 这种规定了元素定位的属性，再然后是 `border` `color` 这种次要的外观属性等。在这排序的过程中，会自动将同类的属性进行分组。但其实要细说下来，同一类别中也不好区分哪条在前，哪条在后比较好，也就是说虽然内心有个大致的重要性分组，但某个分组内再进行排序的话，自己其实也没有个清晰的准则。比如 `width` 和`height` 谁先谁后？

来自Guy Routledge的[这篇文章](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685)展示了他自己的一种按照重要性的排序规则，总结起来就是`outside in`，由外向内，从元素与外界的关系，是否会影响外部布局，到外边距，内边距等。

* 布局相关(position, float, clear, display)，因为元素的布局会对对相邻元素产生影响，自身甚至会脱离原来的文档流，所以比较重要
* 盒模型相关(width, height, margin, padding)
* 外观 (color, background, border, box-shadow)
* 文字排版 (font-size, font-family, text-align, text-transform)
* 其他 (cursor, overflow, z-index)


#### 一个示例

按照上面这种重要性分组的顺序，假若有一个按钮。

```css
/* <a href="#" class="button">Order now &rarr;</a> */
.button { }
```

因为想让按钮有纵向高度，所以将默认的`display`由`inline` 改成 `inline-block`.

```css
.button {
    display:inline-block;
}
```

解决了布局，接下来便是盒模型相关的，内外边距，根据由外而内的顺序，所以先`margin`再`padding`。

```css
.button {
    display:inline-block;
    margin:1em 0;
    padding:1em 4em;
}
```

然后是外观展现。

```css
.button {
    display:inline-block;
    margin:1em 0;
    padding:0.5em 3em;
 
    color:#fff;
    background:#196e76;
}
```

最后加上对按钮文字的排版修饰完工。

```css
.button {
    display:inline-block;
    margin:1em 0;
    padding:1em 4em;
 
    color:#fff;
    background:#196e76;
    border:0.25em solid #196e76;
    box-shadow:inset 0.25em 0.25em 0.5em rgba(0,0,0,0.3), 
               0.5em 0.5em 0 #444;
 
    font-size:3em;
    font-family:Avenir, Helvetica, Arial, sans-serif;
    text-align:center;
    text-transform:uppercase;
    text-decoration:none;
}
```

这一规则大致与前面的盒模型规则类似。

### 工具

CSS 属性本来就没有一个标准规定先写谁后写谁，怎样写都能工作，正是这样的情况导致你想找一种确定的书写方式的时候，面临选择的困难，每个人会有自己的偏好，这个很难达成统一的。

在团队内，常见的会推 JS 的编码风格，甚至会推相应的工具来强制检查。却很少听到有为 CSS 来做这样的风格统一的。我觉得即使不为了考虑团队代码风格的一致性问题，从本文开始列的因素中来看，个人至少是需要养成一种属于自己风格的书写规范，或者选择一种规范来始终坚持。养成习惯后，写起CSS下笔如有神。

如果觉得手工排序麻烦，那么也有相应的工作来自动格式化CSS 代码的。比如  [CSScomb
](http://csscomb.com/)。相应的有编辑器插件，node cli 工具。同时 VSCode的应用市场也有[相应实现](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb)可以选择安装，如果你同意他的这种格式化风格的话。

港真，按照一定规则格式之后的CSS 代码会看起来舒心很多。

### 相关资源

- [“Outside In” — Ordering CSS Properties by Importance](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685)
- [Conventional Order of CSS properties](https://stackoverflow.com/questions/4878655/conventional-order-of-css-properties)
- [CSScomb](http://csscomb.com/)
- [CSScomb VSCode 插件](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb)
