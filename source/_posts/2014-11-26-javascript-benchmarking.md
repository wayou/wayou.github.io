title: JavaScript的基准测试-不服跑个分？
toc: true
categories: 技术
date: 2014-11-26 19:54:36
tags:
- javascript
- 性能
- benchmark
---
>原文：[Bulletproof JavaScript benchmarks](https://mathiasbynens.be/notes/javascript-benchmarking)

做JavaScript的基准测试并没有想的那么简单。即使不考虑浏览器差异所带来的影响，也有很多难点——或者说陷阱需要面对。

<!-- more -->

这是为何我创建了[jsPerf](http://jsperf.com/)的一个原因，一个你可以轻松创建并分享各种代码片段对比结果的简单工具。用起来非常省事，只需把想要测试的代码录入然后jsPerf会为你创建好可以跨平台跑起来的测试用例。

内部实现上，最开始jsPerf用的是一个基于[JSLitmus](http://www.broofa.com/Tools/JSLitmus/)的基准测试库，我将它称作[Benchmark.js](http://benchmarkjs.com/)。后续又往里面添加了更多的特性，最近，[John-David Dalton](http://allyoucanleet.com/)干脆将这个库彻底重写了一遍。所以现在Benchmark.js已经比之前好很多了。

本文将对JavaScript基准测试的编写和运行有一定的参考意义。

# 基准测试的类型

有很多方法可以测试一段JavaScript代码的性能。最常见的做法是类似下面这样的：

## 方案A

```js
var totalTime,
    start = new Date,
    iterations = 6;
while (iterations--) {
  // 被测试的代码
}
// totalTime → 运行该测试代码6次需要的时间（单位：毫秒）
totalTime = new Date - start;
```

这种方案将被测试的代码循环执行多次直到预设值（本例为6次）。最后用结束时的时间减去开始的时间，得到运行的总时间。

 方案A被用于[SlickSpeed](https://github.com/kamicane/slickspeed/), [Taskspeed](https://github.com/phiggins42/taskspeed), [SunSpider](http://www2.webkit.org/perf/sunspider/sunspider.html), 和 [Kraken](http://krakenbenchmark.mozilla.org/)这些流行的基准测试库中。

## 缺憾

 鉴于现在的设备和浏览器运行得越来越快，这种将代码运行固定次数的测试方法有很大概念会得到一个0ms的时间差结果，显然0是毫无意义的。

## 方案B

另一种方案是计算固定时间内进行了多少运算量。较之前的做法，这回你不用指定一个固定的循环次数了。

```js
var hz,
    period,
    startTime = new Date,
    runs = 0;
do {
  // 被测试的代码
  runs++;
  totalTime = new Date - startTime;
} while (totalTime < 1000);

// 将毫秒转为秒
totalTime /= 1000;

// period → 单位运算的耗时
period = totalTime / runs;

// hz → 单位时间（1秒）内进行的运算量
hz = 1 / period;

// 上面两步可以简写如下：
// hz = (runs * 1000) / totalTime;
```

将测试代码一直循环运行直到总耗时`totalTime` 大于等于1000毫秒，也就是1秒种。

方案B 用于[Dromaeo](http://dromaeo.com/)和[V8 Benchmark Suite](http://code.google.com/apis/v8/benchmarks.html)这两个库。

## 不足

由于有垃圾回收，(运行时的)引擎对代码的动态优化以及其他进程等的影响，此方案在重复进行测试时得到的结果不尽相同。为了得到更精确的测试结果，需要多次测试取均值。而上面提到的V8 库只会对测试运行一次，Dromaeo 则会运行5次，但其实还可以做得更彻底以获取更加精准的结果。一个可行的途径就是想办法将目前的测试时间由1000毫秒压缩到50毫秒，当然前提是系统提供给我们一个没有误差且绝对精确的时钟，这能保证时间尽可能多地用于运行测试代码（而不会过多地被操作系统的中间停顿浪费掉）。

## 方案 C

JSLitmus 这个库结合了前面两种方案的优点。采用方案A 来将测试代码运行`n`次，同时动态调整这个`n`值以保证测试能够进行到一个最小的时长，也就是方案B所描述的那样。

## 症结

JSLitmus 规避了方案A的缺点但同时引入了方案B的不足之处。为了进一步提高测试的准确率，JSLitmus 将结果进行了量化，取出3次空测试（译注：不太理解这里的`空测试`为何物，不挂测试代码空跑？？）中运行最快的一次，再将每次基准测试的结果减去这个最快值。不幸的是这种做法为了规避B方案的毛病（译注：B方案需要运行多次以得到更多采样集合以取均值，换句话说要得到越准确的结果就要耗费越多的时间）反而使结果更不可靠了，因为取3次中最快的一次本身就不符合统计规律（译注：按统计学的做法，为了得到3次中最快的一次结果，这里又需要运行另外的测试来拿到一个所谓的最快的结果的集合，然后从中求均值）。尽管JSLitmus可以多次运行这样的基准测试，将量化后的均值与每次测试结果的均值进行差额运算，但这样得到的最终结果其身上的误差已经足够掩盖之前我们为了提高准确率而做的任何努力了。

## 方案 D

前面三种方案的短肋可以通过方法转编(`function compilation` 编译转化之意)和循环展开(loop unrolling)。

```js
function test() {
  x == y;
}

while (iterations--) {
  test();
}

// …将会编译转化为 →
var hz,
    startTime = new Date;

x == y;
x == y;
x == y;
x == y;
x == y;
// …

hz = (runs * 1000) / (new Date - startTime);
```

这种做法将测试代码[变成了展开的形式](http://en.wikipedia.org/wiki/Loop_unwinding)，避免了循环和量化工作(译注：没有了循环也就无需统计单位时间内的运算量了)。

## 问题

然而，纵然如此它还是有不足之处的。将函数转编会消耗大量内存同时也把CPU拖慢。当你把一个测试跑上几百万次时，可以想象到会创建大量的字符串和转编无数的函数。

这还不算，因为一个函数完全有可能在遇到`return`后提前结束执行。所以如果测试中函数在第3行就返回了，将循环展开成上百万的代码就显得毫无意义。看来检测这些可能的提前退出还是很有必要的，然后回归到使用`while`语句（也就是方案A的做法）加上对循环结果的量化。

## 函数体的提取

在Benchmark.js的实现中，使用了一个稍微不同的做法。你可以认为它结合了方案A,B,C还有D的长处。考虑到内存因素，我们没有将循环展开。为了控制住增大结果误差的因素，同时又让测试代码可以使用较为自然的实现和变量，我们将每个测试代码的函数体提取出来。譬如，当用下面的代码进行测试时：

```js
var x = 1,
    y = '1';

function test() {
  x == y;
}

while (iterations--) {
  test();
}

// …转会转编为 →

var x = 1,
    y = '1';
while (iterations--) {
  x == y;
}
```

如此一来，Benchmark.js 使用一个与 JSLitmus近似的技术：将提取出来的函数体放到一个循环中（这是方案A的做法），重复执行直到达到一个最小的时限（这是方案B），最后重复整个流程取一个严格意义上的统计均值作为结果。

# 注意事项

## 有偏差的毫秒时钟

某些浏览器与操作系统的组合中，由于[种种](http://msdn.microsoft.com/en-us/windows/hardware/gg463347.aspx)[因素](http://alivebutsleepy.srnet.cz/unreliable-system-nanotime/)存在时钟不准的情况。

例如：
> Windows XP开机后，程序执行的时钟周期为 10毫秒，这在其他操作系统中一般为15毫秒。意思就是每隔10毫秒操作系统会接收到来自硬件（译注：也就是CPU的时钟系统）的一次中断。

一些很老的浏览器（IE或者火狐2）严重依赖操作系统的时钟，也就是说每次你调用`new Date().getTime()`它其实直接从系统那里去拿这个时间。很显然，如果内部系统的时间都只间隔10毫秒或者15毫秒才更新一次，那测试结果会受很大影响，准确性大大降低。这个问题是需要解决的。

值得庆幸的是，JavaScript是可以[拿到最小的时间度量单位](https://mathiasbynens.be/demo/javascript-timers)的。这之后，我们可以通过[数学方式](http://spiff.rit.edu/classes/phys273/uncert/uncert.html)将测试结果的不确定性降低到只有1%。为此，我们将这个最小时间度量单位除以2以得到这个*不确定性*的值。假设我们在XP上用IE6，此种情况下最小的度量单位是15毫秒。这个不确定性的值就为`15ms/2=7.5ms`。然后我们想控制结果的误差到1%，于是乎我们将刚才得到的不确定性值除以0.01，就得到了达到测试要求需要的最小测试时限为：`7.5/0.01=750ms`。

## 备选时钟

当启用`--enable-benchmarking` 标志后，Chrome和Chromium会暴露出一个叫做`chrome.Interval`的方法，可以用它作为一个高精度的时钟。

在编写Benchmark.js库时， John-David Dalton 经过一番折腾后将Java里这个纳秒级的时钟通过一个小的Java applet插件暴露到了JavaScript中。

使用更高精度的时钟可以缩短测试周期，相应地可以跑更多测试样本，从而得到一个误差更小的测试结果。

## Firebug 会禁用火狐的 JIT

启用Firebug后会禁用火狐高性能的实时(just-in-time [JIT](http://en.wikipedia.org/wiki/Just-in-time_compilation))本地代码编译，然后你的代码会跑在普通的JavaScript解释器里面。这将会比原先慢很多。所以在跑基准测试时千万记得关掉Firebug。

其他浏览器的元素审查工具比如WebKit的`Web Inspector`或者欧朋浏览器的`Dragonfly`在开启时也有类似问题，尽管相比于上面的情况会小很多。所以在跑测试时最好还是关掉这些，或多或少还是会影响测试结果的。

## 浏览器缺陷和特性

基准测试内部实现中的一些循环机制容易受到一些浏览器本身缺陷的影响，比如像最近IE9的[dead-code-removal](http://www.zdnet.com/blog/bott/ie9-takes-top-benchmark-prize-no-cheating-involved/2671)展示的那样。[火狐`TraceMonkey` 引擎](https://bugzilla.mozilla.org/show_bug.cgi?id=509069)的一个bug，还有欧朋11 [对`querySelectorAll`结果的缓存](http://jsperf.com/jquery-css3-not-vs-not)都会影响到测试结果。这些都是在进行测试是需要注意的。

## 统计学的重要性

大多数的基准测试/测试代码给出的结果并且没有严格符合统计学要求。John Resig（译注：jQuery原始作者）在他早前的一篇文章「[JavaScript 基准测试的质量](http://ejohn.org/blog/javascript-benchmark-quality/)」中有提到。简单来说，就是应该尽量考虑到每个测试结果的误差并去减小它。扩大测试的样本值，健全的测试执行，都能够起到减少误差的作用。

## 跨浏览器的测试

如果你想在不同浏览器中进行测试且想得到较可靠的结果，一定要在真实的浏览器中测试。不要依赖于IE自带的兼容模式，此模式跟他[所模拟的版本是存在实质性差异](http://jsperf.com/join-concat#comments)的。

还有就是除了跟大多其他浏览器一样会限制脚本的时间，IE(8及以下)还限制了代码的指令数不能超过5百万。事实上以现在CPU的吞吐能力，这样的数量级处理起来只是半秒钟的事情。如果你配置确实过硬，跑起来倒也没什么只是IE会给出一个`Script Warning`的警告，这种情况下你可以通过修改注册表来增大这个数量限制。幸运的是微软还提供了一个[修复助手的程序](http://go.microsoft.com/?linkid=9729250)，你只需要运行即可，比修改注册表方便多了。更可喜的是，IE9以上，这个逗逼的限制被移除了。

# 总结

无论你只是跑了一些测试，或者写一些用例，抑或正在自己写一个基准测试库，关于JavaScript基准测试的奥义远比你看到得要多（译注：就是水很深，并不是跑个分那么简单）。Benchmark.js和jsPerf[每周都有更新](https://github.com/bestiejs/benchmark.js/commits/master)，包含bug修复，新功能添加和一些提升准确率的技巧。但愿主流浏览器也能够为此做些努力吧...








