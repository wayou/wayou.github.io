
#### 外边距的塌缩/ Margin Collapsing

关于外边距，还有个有趣的现象，某些情况下相邻元素的外边距会发生重合成为一个，这一现象叫作「外边距塌缩（margin collapsing）」，塌缩后形成的新的外边距叫作塌缩外边距（Collapsing margins）。外边距塌缩，塌缩外边距，宽宽的河，肥肥的鹅，鹅要过河，河要渡鹅...

具体来说，W3C 的文档给出了不会发生塌缩的情形。即横向的外边距永远不会塌缩，垂直方向，除以下情况外会塌缩：

Margins of the root element's box do not collapse.
If the top and bottom margins of an element with clearance are adjoining, its margins collapse with the adjoining margins of following siblings but that resulting margin does not collapse with the bottom margin of the parent block.
* 根节点的外边距
* 带浮动清除的元素上下外边距相邻时，会与毗邻的元素发生塌缩，但塌缩后的外边距不会再与父容器的下外边距发生二次塌缩

*科普小贴士*
> 来自 W3C 规范中对 `clear` 样式属性的一段描述：
> Values other than 'none' potentially introduce clearance. Clearance inhibits margin collapsing and acts as spacing above the margin-top of an element. It is used to push the element vertically past the float.
> 元素的 `clear` 样式属性会引入 浮动清除（clearance），这里表明清除浮动与外边距塌缩是有相关性的。浮动清除会抑制塌缩，它的表现看起来像是在元素 `margin-top` 上面添加了一块空间。

来自 MDN 的文档则列出了会发生塌缩的情况：

Adjacent siblings
The margins of adjacent siblings are collapsed (except when the latter sibling needs to be cleared past floats).

Parent and first/last child
If there is no border, padding, inline part, block formatting context created, or clearance to separate the margin-top of a block from the margin-top of its first child block; or no border, padding, inline content, height, min-height, or max-height to separate the margin-bottom of a block from the margin-bottom of its last child, then those margins collapse. The collapsed margin ends up outside the parent.

Empty blocks
If there is no border, padding, inline content, height, or min-height to separate a block's margin-top from its margin-bottom, then its top and bottom margins collapse.

* 毗邻的兄妹元素会发生塌缩，除非两者中的后者有带有清除浮动的样式（except when the latter sibling needs to be cleared past floats）。(TODO: 暂时无法理解括号内的例外情况 提了个问题 https://stackoverflow.com/questions/47550305/css-margin-collapsing-except-when-the-latter-sibling-needs-to-be-cleared-past-f)  
![水平毗邻，发生塌缩](adjacent-siblings-vertical.png)
![水平方向的外边距不发生塌缩](adjacent-siblings-horizontal.png)

关于排除的这种情况，我没理解到，不过[来自 stackoverflow 的这个回答](https://stackoverflow.com/a/35257402/1553656)给出了示例。
![水平毗邻-后者带浮动清除-不发生塌缩](adjacent-siblings-vertical-with-clearfix.png)

* 父容器与首末子元素间。如果没有如下元素，边框/border, 内边距/padding, 行内元素/inline part, 块级上下文/block formatting context 或者浮动清除/clearance等将该父容器的 margin-top 与其首个子元素相隔开；或者没有边框/border, 外边距/padding, 内行元素/inline content, 高度/height, 最小高度/min-height 或者最大高度/max-height将父容器的margin-bottom 与末位子元素隔开，则会产生塌缩。（TODO: 也没太理解）

* 空元素。如果没有边框（border），内边距（padding），行内元素(inline content)，高度(height)或最小高度（min-height）将元素的上下外边距隔开，则他们会塌缩。（TODO: 实测并不是，待进一步验证，看是不是姿势不对）


[这篇博文](https://kilianvalkhof.com/2008/css-html/random-css-thought-margin-collape-css-property/)中也有总结一些塌缩发生的情况：

* 只发生在正常文档流（[normal flow](http://kilianvalkhof.com/2008/css-xhtml/understanding-css-positioning-part-1/)）的情况下
* 水平外边距不存在这个问题
* 当元素有边框或内边距时不会塌缩
* 当元素绝对或相对定位时不会塌缩
* 元素有浮动或者清除浮动时不会塌缩

来自 [sitepoint 的这篇文章](https://www.sitepoint.com/collapsing-margins/) 则给出了不塌缩的情形:

* floated elements 浮动元素
* absolutely positioned elements 绝对定位的元素
* inline-block elements 行级元素
* elements with overflow set to anything other than visible (They do not collapse margins with their children.) `overflow` 设置为非 `visible` 的元素，不会与子元素发生塌缩
* cleared elements (They do not collapse their top margins with their parent block’s bottom margin.) 清除浮动的元素，其上外边距不与父容器的下外边距塌缩
* the root element 根节点


#### 塌缩后的边距计算规则

* 正常来说，发生塌缩的两个外边距，取大的那一个
* 当其中任意一个外边距是负数时，塌缩后的外边距为两者之和的结果，譬如元素一外边距`-5px`，元素二外边距 `10px`，塌缩后两者间的最终外边距为 -5 + 10 = 5px
* 如果两者都为负值，取较绝对值较大的那个


### 元素间的塌缩


### 嵌套元素的塌缩

这个示例很好地展现了元素嵌套情形下的外边距塌缩。
```css
.box {
  margin: 10px;
}
.a {
  background: #777;
}
.b {
  background: #999;
}
.c {
  background: #bbb;
}
.d {
  background: #ddd;
}
.e {
  background: #fff;
}
```


#### 塌缩是缘何

了解了上面的塌缩现象后，不免会有疑问：是规范这样设置还是浏览器实现上的缺陷，为什么会引入塌缩，塌缩的起因是什么。
如果是 Bug，这么多年就没人管管么？既然被写在规范里存在了这么久，看起来不像是个问题，反而是特性。这就让人苦恼了，我要这塌缩有何用。
如果不是特性的话，这种表现在所有浏览器都一致么，我们在写代码的时候能够唯一确定何时塌缩，塌缩后的边距可预期么。



* [Mastering margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
* [Random CSS Thought: Margin-collape CSS property](https://kilianvalkhof.com/2008/css-html/random-css-thought-margin-collape-css-property/)
* [clear](https://developer.mozilla.org/en-US/docs/Web/CSS/clear)
* [Do vertical margins collapse reliably and consistently across all browsers?](https://stackoverflow.com/questions/28175257/do-vertical-margins-collapse-reliably-and-consistently-across-all-browsers)
* [What You Should Know About Collapsing Margins](https://css-tricks.com/what-you-should-know-about-collapsing-margins/)
