## Table 单元格合并也大有门道


### 背景

之前项目中使用 Angular `ng-repeat` 动态生成的表格有合并单元格的需求，所以在生成 `td` 标签时统一加了 `rowspan` 属性，具体的 span 值呢动态计算。如果不需要合并则返回 0。

调试完上线一切工作正常，至少用当时的 Chrome 来看，没发现问题。

但，最近有收到反馈表格展示不正常了。

本来应该是这个样子美如画的表格：

![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/table-rowspan/assets/normal-table.png)

￼
出现问题后的表格成了这样子：

![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/table-rowspan/assets/broken-table.png)
￼
相信很难从这个出问题表格再在脑海中还原其率真的样子。


### 领悟

当看到这个问题后，男人的直觉告诉我，这是一个兼容性问题。但万万没想到是向前兼容的问题！因为发现是升级到新版 Chrome 后才会出现。

事后找出的原因，着实有点猝不及防。毕竟平日里解决了无数向后兼容老浏览器的问题，这种向前因为新版浏览器才出现的问题还真是活久见。

在 jsfiddle 上面制作了一个简化版的场景还原 [Demo](http://jsfiddle.net/Wayou/jt5Lwp9a/) 方便观察。

其中每个表格单元格都通过 `ng-repeat` 动态生成。其 `rowspan` 值也根据数据计算，当发生 `rowspan` 时后续表格行中单元是否该展示也是计算得当的。

所以正常来看，展示还是很完美的。下面是 Chrome 64中的效果：

![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/table-rowspan/assets/normal.png)


生成的表格代码如下：

```html
<table>
    <thead>
        <tr>
            <th>name</th>
            <th>age</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="0">foo</td>
            <td rowspan="3">29</td>
        </tr>
        <tr>
            <td rowspan="0">bar</td>
        </tr>
        <tr>
            <td rowspan="0">baz</td>
        </tr>
    </tbody>
</table>
```

而在Chrome 65中是这样子的：
￼
![](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/table-rowspan/assets/broken.png)


可以看到，后续表格行跑到和每一行齐头并进的位置。

后来才发现，正是这多余的 `rowspan` 属性导致了新版 Chrome 下展示不正常了，可能新版中对非法 HTML 的容忍度——降低了？！


### 表格的合并属性

讲道理，如果单元格不需要合并，那正常来说是不需要指定合并属性（`rowspan`, `colspan`）的。但是，如果指定了，并且值为 0，讲道理按照字面意思，应该也等同于不合并才对。并且，之前的 Chrome 中确实是这样表现的。

那么这个属性的取值，究竟有何玄机？看来，是时候严肃地了解一下表格单元格的合并属性了。带着疑问我决定去 Google 一下。

首页， 地位堪比山东蓝翔的前端网校 [W3school 在介绍 rowspan](https://www.w3schools.com/tags/att_td_rowspan.asp) 时给出了这样一句 有用的注释：

> *Note*: rowspan="0" tells the browser to span the cell to the last row of the table section (thead, tbody, or tfoot)

再去看看 [W3C 的解释](https://www.w3.org/TR/html401/struct/tables.html#adef-rowspan)，毕竟更权威。上面的文档这样说道：

> This attribute specifies the number of rows spanned by the current cell. The default value of this attribute is one ("1"). The value zero ("0") means that the cell spans all rows from the current row to the last row of the table section (THEAD, TBODY, or TFOOT) in which the cell is defined.

看来表述和蓝翔网校是一致的，指定 `rowspan=“0”` 时表示合并当前单元格直到表格的最后一行。

只能说太年轻，对这个属性的理解不够深，还是太想当然了。如果说之前写成 `rowspan=“0”` 是错误的，那应该达不到需要的表现才对，只能说 Chrome 54 及其他老版本浏览器也不太厚道了，没有按照规范来解析。

注意到上面 W3C 的介绍中的提及了该属性默认值是1，也就是说如果想要不发生合并，正常的值应该给1才对，而不是0。


### 结论

所以，将生成的表格中不需要合并的单元其 `rowspan` 的值改成默认的1 后，展示恢复到正常。

生成的表格看起来像是这样：

```html
<table>
    <thead>
        <tr>
            <th>name</th>
            <th>age</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=“1”>foo</td>
            <td rowspan="3">29</td>
        </tr>
        <tr>
            <td rowspan=“1”>bar</td>
        </tr>
        <tr>
            <td rowspan=“1”>baz</td>
        </tr>
    </tbody>
</table>
```

所以万万没想到，其实也不算向前兼容的问题，毕竟规范一直是那样，只是浏览器解析展示更贴近规范，要求代码也需要同步地贴近规范。


### 相关资源

- [W3C rowspan](https://www.w3.org/TR/html401/struct/tables.html#adef-rowspan)
- [W3school rowspan](https://www.w3schools.com/tags/att_td_rowspan.asp)
