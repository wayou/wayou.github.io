---
layout: post
title: "High fan-in low fan-out"
date: 2021-07-20T00:22:04Z
---
读 《Code Complete》 学到个新术语， "fan-in","fan-out"。可能是电子术语， 根据 [Intel 上面的解释]([an-in and fan-out]（https://book.douban.com/subject/35470123/）)，

- fan-in 表示逻辑单元最大输入信号量
- fan-out 逻辑单元最大输出信号量

而借用到编程中的设计模式中， 应遵循 ”high fan-in low fan-out“ 的准则， 

- High fan-in 表示基础类应该被尽量多地复用， 避免在高级类中重复造轮子
- Low fan-out 表示基础类中应该尽量少地引入其他类， 功能聚焦

以下是来自 Code Complete 的原文：

> High fan-in High fan-in refers to having a high number of classes that use a given class. High fan-in implies that a system has been designed to make > good use of utility classes at the lower levels in the system. 5.2 Key Design Concepts 81
> 
> Low-to-medium fan-out Low-to-medium fan-out means having a given class use a low-to-medium number of other classes. High fan-out (more than about seven) > indicates that a class uses a large number of other classes and may therefore be overly complex. Researchers have found that the principle of low fan-out > is beneficial whether you’re considering the number of routines called from within a routine or the number of classes used within a class (Card and Glass > 1990; Basili, Briand, and Melo 1996). 
> -- _Code Complete_


低级类或工具方法代表职责单一的功能模块， 尽可能多地将功能重复的部分抽取到其中，然后在其他地方进行复用，一是避免冗余代码，二是方便后期维护升级。

同时， 具体到某个功能单一的单元中， 因为职责已经很聚焦了， 所需要实现的功能也无法再拆， 所以无需再引入其他类，做到 low fan-out.



## 相关资源

- [an-in and fan-out](https://book.douban.com/subject/35470123/)
- [Design Principle High Fan in vs High Fan out](https://stackoverflow.com/questions/4092228/design-principle-high-fan-in-vs-high-fan-out)
