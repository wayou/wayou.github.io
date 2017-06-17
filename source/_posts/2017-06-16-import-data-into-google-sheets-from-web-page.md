title: 导入网页数据到 Google Sheet
date: 2017-06-16 08:20:01
toc: false
categories: 数据
tags:
- Google
- Sheet
---

数据没有用，我们需要的是数据所反映出来的东西。增长率，排名，占比等。而这些结果是通过分析数据得到的。
从网上搜集到数据后，导入到表格程序中便可以进行方便地分析处理了。下面介绍将网页中的表格数据导入到 Google Sheet 中的操作。
<!-- more -->

当我尝试去 Google 相关方法的时候，对于这个搜索结果相当的满意。不仅给出了来自 Youtube 的视频教程，还给出了建议观看的位置。这样的产品细节让很多竞品难以匹敌。

![Goolge 搜索结果](1.jpg)

[Import HTML in Google Docs](https://www.youtube.com/watch?v=95c0OlsjKgU)，你可以自行观看也可以继续阅读本文。

利用 `importHTML` 公式可以轻松实现将网页中的数据导入到我们的工作表当中。

![importHTML 公式](2.jpg)

该公式需要三个入参，分别是：
- `url` 导入数据的网页地址
- `query` 指定数据的类型，是页面中的列表（ul,ol）还是表格（table）
- `index` 指定需要导入的索引，如果页面中不止一个数据源，则可以通过这个来指明导入第几个

我们以 [List of countries by GDP](https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)这个来自 Wikipedia 的国家 GDP 排名页面为列，将其中的表格数据进行导入。

![来自 Wikipedia 的国家 GDP 排名](3.jpg)

在需要导入的单元格里输入以下公式：

```
=importHTML("https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)","table",3)
```

然后执行。数据加载完成后，页面中第三个 table 的数据就被导入了。

![导入成功后的数据](5.jpg)

回顾上面的参数，第一个 url 没问题，就是浏览器地址栏里的，直接复制粘贴。
第二个参数自不必多说，我们需要导入的不是列表，而是`table`。
而最后个参数为什么是3？因为如果是1的话导入的数据并不正常，所以页面的 HTML 代码中有隐藏的用于布局的 `table`，我们需要跳过，尝试到3的时候有数据了。

对于没有网页编程相关经验的人来说，总之可以从1开始试，通过导入的结果便可知道是否是想要的数据。

当数据在专业的表格程序中的时候，分析处理起来就很得心应手了。譬如我们觉得表格数据不够直观，可以快速简单点两下就能插入一个地区图。

假设我们想要观察 GDP 排名前20的国家在地图上的分布。首先选中所需数据。
选择`Insert->Chart...`

![插入图表](6.jpg)

在弹出的图表编辑框中，指定图表类型为`Geo chart`。

![插入地理图表](7.jpg)

数据一下子就直观起来了！

但通过图片看出问题来了，也就是少了些很重要的经济体，譬如兔子，战斗民族。
回头看表格中的数据，China 的名字似乎不对，将数据复制一分出来到 `Sheet2`，将名字更正一下，再重复上面的步骤。

![修正后的图表数据](8.jpg)

这是完工后的工作表，[前往参观](https://docs.google.com/spreadsheets/d/10N5-jwkD-J36XntGC3hsUN-Wo5V_McaUrBVyx0pjQ3A/edit?usp=sharing)。
