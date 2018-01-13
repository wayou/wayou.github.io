## 理解时间复杂度 O(log n)


解决实际问题时，代码是否高效会成为问题解决的关键。高效的算法可以将资源开销控制在有限范围内将问题解决。而衡量一个算法优劣的标准则是时间复杂度，我们经常会看到 O(n) 这样的记号。

对于 O(1) ，它表示时间复杂度为1，即解决这一问题的实现很直接，只需一步或者固定几个步骤。比如从哈希表中取值，通过索引只需在哈希表中查找一次便得到结果。而 O(n) 表示完成这一任务的时间复杂度与输入有关，与输入成正比，比如遍历数组。

而 O(log n) 又该怎样理解？它的典型场景便是二分查找法。他的原理是不断将输入进行二等分直到找到目标。

假设我们要从如下一个已经排好序长度为16的数列中找到指定的数字13：

![一个长度为16已经排好序的数列](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/a-sorted-array-of-16-elements.png)

_一个长度为16已经排好序的数列_


* 找到中间元素，这里也就是元素16所处的位置，它中间为分界线将整个数列均分。

![选中正中间的元素作为分界线](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/select-mid-as-pivot.png)

_选中正中间的元素作为分界线_


* 将目标与中间元素进行比较，因为13小于16，所以我们保留前半部分继续寻找。 

![保留前半部分](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/keep-half.png)

_保留前半部分_


* 重复上面的步骤，找到中间元素 8，因为13比8大，所以保留8后面的这部分

![重复上面的步骤](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/repeat-steps.png)

_重复上面的步骤_


* 继续上面的步骤，直到没有剩余的元素便找到我们的目标了。

![直到找到目标](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/till-find-result.png)

_直到找到目标_

上面的步骤，第一次操作都将总数减小到原来的一半。我们从16个元素中找一个目标时二分了4次，`16*(1/2)*(1/2)*(1/2)*(1/2)` 总结成公式：

![16个元素中二分的公式](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/simplify-formula.png)

_16个元素中二分的公式_


推而广之，从 n 个元素中查找，需要多少次呢，还不知道，假设需要 k次。那么用上面的公式则可以表示为：

![从 n 个元素中查找的公式](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/general-formula.png)

_从 n 个元素中查找的公式_


去掉幂的括号则变成了：

![去掉公式中幂的括号](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/separating-the-power.png)

_去掉公式中幂的括号_


最后我们去掉分母，得到了一个简洁的公式：

![简洁的公式](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/common-formula.png)

_简洁的公式_


此时如何求 k 的值呢。就需要用到对数了。

> 如果你对对数感到陌生了，可以先来回顾一下它的定义，请看来自百科的解释：
> 在数学中，对数是对求幂的逆运算，正如除法是乘法的倒数，反之亦然。 这意味着一个数字的对数是必须产生另一个固定数字（基数）的指数。

所以对上面公式两边取对数便得到了 k 的值，

![对数公式](https://raw.githubusercontent.com/wayou/wayou.github.io/master/posts/understanding-logn-time-complexity/assets/log-formula.png)

_对数公式_


于是，我们推导出了如果输入为 n，查找一个结果的时间复杂度为 O(log n)。


### 相关资源

* [What does the time complexity O(log n) actually mean?](https://hackernoon.com/what-does-the-time-complexity-o-log-n-actually-mean-45f94bb5bfbf)
* [Examples of Algorithms which has O(1), O(n log n) and O(log n) complexities](https://stackoverflow.com/questions/1592649/examples-of-algorithms-which-has-o1-on-log-n-and-olog-n-complexities)
* [对数](https://baike.baidu.com/item/%E5%AF%B9%E6%95%B0/91326?fr=aladdin)

