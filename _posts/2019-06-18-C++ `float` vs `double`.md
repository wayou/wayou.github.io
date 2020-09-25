---
layout: post
title: "C++ `float` vs `double`"
date: 2019-06-18 23:06:00 +0800
tags: 
---
    
# C++ `float` vs `double`



## 精度

相比 `float` ，`double` 从其名字上已经展示出，它的精度是前者的两倍，他们的精度分别为：

- `float`: 7 位数字
- `double`: 15 位数字

可通过如下的示例看出，在重复进行计算时，精度差异开始显现：

```cpp
float a = 1.f / 81;
float b = 0;
for (int i = 0; i < 729; ++ i)
    b += a;
printf("%.7g\n", b); // prints 9.000023
```

```cpp
double a = 1.0 / 81;
double b = 0;
for (int i = 0; i < 729; ++ i)
    b += a;
printf("%.15g\n", b); // prints 8.99999999999996
```

尽管如此，`double` 也不是十分精确，所以还有 `long double` 类型，该类型下上面的结果为 `9.000000000000000066`。所有浮点型都面临精度丢失的问题，所以处理高精度的场景，比如涉及金钱，最好用 `int` 或单独的分数类（fraction class）。

## 上限

两者上限不同，

- `float`: `3e38`
- `double`: `1.7e308`

所以使用 `float` 出现瓶颈的概率会比 `double` 大些，特别是计算阶乘这种情况下。

## 选择

而关于两者的选择，《C++ Primer》 是这样描述的：

> “Use `double` for floating-point computations; `float` usually does not have enough precision, and the cost of double-precision calculations versus single-precision is negligible. In fact, on some machines, double-precision operations are faster than single. The precision offered by `long double` usually is unnecessary and often entails considerable run-time cost.”
> 
> _--Stanley B. Lippman. “C++ Primer, Fifth Edition (Jason Arnold's Library).”_ 

鉴于 `float` 精度不够，对于有小数的情况建议使用 `double`。但考虑到性能， `long double` 性价比就不高了。

## 相关资源

- [What is the difference between float and double?](https://stackoverflow.com/questions/2386772/what-is-the-difference-between-float-and-double)


    