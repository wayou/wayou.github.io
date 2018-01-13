## CSS 属性的排序

不知道有多少人思考过将 CSS 属性排序的问题。反正在我书写网页的无数个日子里，是有想过这个问题的。

因为大多数时候，调样式写属性完全就是按需要来，调一个加一条，样式调好后，整个元素的代码也就确定了。

偶尔会因为美观刻意把自己认为需要提前的属性放到前面一下，仅此而已。

这种下意识的行为让我觉得，冥冥之中，应该有一些可用的约定，来指导我们，将这些纷繁的 CSS 样式属性进行合理地排列。

果不其然，著名 CSS 站点 css-tricks 为此专门做了个[问卷调查](https://css-tricks.com/poll-results-how-do-you-order-your-css-properties/)，结果显示：

- 按类型来分组的占 45%
- 完全不 care 这件事，写起来随意的占39%
- 按属性字母顺序的占14%
- 最后还有按一行代码长度来排序的占2%

感受下最后这种排序方式：

```css
.button
{
    box-shadow: inset .25em .25em .5em rgba(0, 0, 0, .3), .5em .5em 0 #444;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    border: .25em solid #196e76;
    text-decoration: underline;
    text-transform: uppercase;
    display: inline-block;
    padding: 1em 4em 2em;
    text-align: center;
    margin: 1em auto;
    font-size: 3em;
    color: #fff;
}

```


### 将 CSS 属性排序的意义

属性顺序本无关紧要，夫意欲何为？

我认为，让 CSS 属性保持一定的规律有一些好处：

- 作为写程序的人，除了希望代码的输出具有确定性，即每写一行代码我知道我在写什么，我能预知到结果，还希望从代码风格上保持一致，这样在写类似功能时，写出来的东西是有某种确定性的，代码会有种统一的风格在里面，同时阅读起来会很轻松
- 当这些看似杂乱无序的属性在书写时遵从一定规律后，改起来会很方便。比如我习惯将 `width`，`height`这种基本的常用的属性写在元素样式的最前面，我在改的时候就直接到最前面去找
- 会有一种，哲学上的美。恩，就是看起来舒心的那种。写码也是种艺术创作，只不过陈老师用相机，我们用键盘。没有风格的编码是新手，想到哪写到哪，而具有一定风格的代码或许是老司机，虽然所坚持的风格不一定普适。


### 盒模型规则的排序

关于 CSS 属性书写时的排序问题，是有一些讨论已经存在的，比如 StackOverflow 上的这个提问 [Conventional Order of CSS properties](https://stackoverflow.com/questions/4878655/conventional-order-of-css-properties)，里面有提到一个叫作 [The CSS Box Model Convention](https://web.archive.org/web/20130227044124/http://fordinteractive.com/2009/02/order-of-the-day-css-properties/) 的约定，该约定里罗列的顺序是按照 CSS 盒模型来的。

具体来说，可概括为如下的分组顺序：

1. 展示类型及文档流相关/Display & Flow
2. 定位信息/Positioning
3. 元素尺寸/Dimensions
4. 边距边框/Margins, Padding, Borders, Outline
5. 文字排版/Typographic Styles
6. 背景/Backgrounds
7. 其他如透明度，光标样式及衍生内容/Opacity, Cursors, Generated Content

具体到代码：

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


### 按字母排序

除了上面这个比较知名的规则，还有一种大部分人用的方式则更加简单粗暴，那就是上面问卷结果中有出现过的，按属性的字母排序（Alphabetical），用的人还不少。这种规则简单明了，写起来也不用多想，个人觉得没多大必要，有点为了排序而排序的感觉，并无多大实用之处。


### 按照重要性的分组排序

来自 Guy Routledge 的[这篇文章](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685)展示了一种分组及按照重要性排序的方式，或者说基于此种方式下他自己的一种排序规则。

总结起来就是`outside in`，由外向内，从元素与外界的关系，是否会影响外部布局，到外边距，内边距等。

1. 布局相关(position, float, clear, display)，因为元素的布局会对对相邻元素产生影响，自身甚至会脱离原来的文档流，所以比较重要
2. 盒模型相关(width, height, margin, padding)
3. 外观 (color, background, border, box-shadow)
4. 文字排版 (font-size, font-family, text-align, text-transform)
5. 其他 (cursor, overflow, z-index)


#### 一个示例

按照上面这种重要性分组的顺序，来看一个示例。

假若有一个按钮：

```css
/* <a href="#" class="button">Order now &rarr;</a> */
.button { }
```

因为想让按钮有纵向高度，所以将默认的 `display` 由 `inline` 改成 `inline-block`.

```css
.button {
    display:inline-block;
}
```

解决了布局，接下来便是盒模型相关的，内外边距，根据由外而内的顺序，所以先 `margin` 再 `padding`。

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


### 我眼中的排序规则

就我个人而言，倾向于将比较重要的常用的放在靠前位置，像元素的长宽`width` `height`这种，影响尺寸，也很直观，我认为是比较重要的属性。

其次是`position` 这种规定了元素定位的属性，再然后是 `border` `color` 这种次要的外观属性等。

虽然在这排序的过程中，会自动将同类的属性进行分组。但其实要细说下来，同一类别中也不好区分哪条在前，哪条在后比较好，也就是说虽然内心有个大致的重要性分组，但某个分组内再进行排序的话，自己其实也没有个清晰的准则。

比如 `width` 和`height` 谁先谁后？或许在确定了整体排序规则后，同一分组内的排序就没那么重要了。

所以，用工具解决就不用那么纠结。


### 工具

CSS 属性本来就没有一个标来准规定先写谁后写谁，怎样写都能工作，正是这样的情况导致你想找一种确定的书写方式的时候，面临选择的困难，每个人会有自己的偏好，这个很难达成统一。

在团队内，常见的会推 JS 的编码风格，甚至会推相应的工具来强制检查。却很少听到有为 CSS 来做这样的风格统一的。我觉得即使不为了考虑团队代码风格的一致性问题，从本文开始列的因素中来看，个人至少是需要养成一种属于自己风格的书写规范，或者选择一种规范来始终坚持。养成习惯后，写起 CSS 下笔如有神，文思如泉涌。

如果觉得手工排序麻烦，那么也有相应的工作来自动格式化 CSS 代码的。比如  [CSScomb
](http://csscomb.com/)。相应的有编辑器插件，Node CLI 工具。同时 VSCode 的应用市场也有[相应实现](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb)可以选择安装。

当然，该工具有自己的一套排序机制，它主要还是对 CSS 的分组及格式化方面的支持，并没有使用上面的某种规则来排序。但使用它能够保证 CSS 属性按照一定顺序恒定输出。如果你同意他的这种格式化风格的话，使用这个插件会是比较省事的选择。

通过他提供的在线工具我尝试了一个示例，大部分是相同的代码，两个类名里面打乱了顺序，第二个类里面进行了属性的删减，期望的输出结果是两个按钮类中每个属性所处的位置不变。

*格式化前*

```css
.btn {
  display: inline-block;
  margin: 1em 0;
  font-size: 3em;
  padding: 1em 4em;
  color: #fff;
  box-shadow: inset 0.25em 0.25em 0.5em rgba(0, 0, 0, 0.3), 0.5em 0.5em 0 #444;
  background: #196e76;
  border: 0.25em solid #196e76;
  text-decoration: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  text-transform: uppercase;
}

.btn2 {
  border: 0.25em solid #196e76;
  text-transform: uppercase;
  padding: 1em 4em;
  color: #fff;
  box-shadow: inset 0.25em 0.25em 0.5em rgba(0, 0, 0, 0.3), 0.5em 0.5em 0 #444;
  background: #196e76;
  text-decoration: none;
  font-size: 3em;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
```

*格式化后*

```css
.btn
{
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 3em;

    display: inline-block;

    margin: 1em 0;
    padding: 1em 4em;

    text-align: center;
    text-decoration: none;
    text-transform: uppercase;

    color: #fff;
    border: .25em solid #196e76;
    background: #196e76;
    box-shadow: inset .25em .25em .5em rgba(0, 0, 0, .3), .5em .5em 0 #444;
}

.btn2
{
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 3em;

    padding: 1em 4em;

    text-align: center;
    text-decoration: none;
    text-transform: uppercase;

    color: #fff;
    border: .25em solid #196e76;
    background: #196e76;
    box-shadow: inset .25em .25em .5em rgba(0, 0, 0, .3), .5em .5em 0 #444;
}
```

该插件支持自定义样式规则，通过其提供的[在线工具](http://csscomb.com/config)可以方便地生成满足自己风格的规则。使用[VSCode 插件](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb) 需要注意，需要在设置中指定一种格式化预设配置才能生效。

```json
{
    "csscomb.preset": "csscomb" //其他规则或者自定义规则
}
```

除了在编辑器中进行设置，还可以生成一个配置文件，放在项目根目录中，类似`.editorconfig`，这样项目中其他人可以共用同一份配置，达到团队代码风格的统一。

### 结论

港真，按照一定规则格式之后的 CSS 代码会看起来舒心很多。

选择一种风格，或者形成并保持自己的风格。程序人生路漫漫，代码风格常相伴。

「你吃的苦会照亮你未来的路」，你的坚持，不会是白白的付出。

![冰花男孩](https://raw.githubusercontent.com/wayou/wayou.github.io/master/assets/css-properties-order-convention/assets/ice_boy.jpg)


### 相关资源

- [Poll Results: How do you order your CSS properties?](https://css-tricks.com/poll-results-how-do-you-order-your-css-properties/)
- [“Outside In” — Ordering CSS Properties by Importance](https://webdesign.tutsplus.com/articles/outside-in-ordering-css-properties-by-importance--cms-21685)
- [Conventional Order of CSS properties](https://stackoverflow.com/questions/4878655/conventional-order-of-css-properties)
- [CSScomb](http://csscomb.com/)
- [CSScomb VSCode 插件](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb)
