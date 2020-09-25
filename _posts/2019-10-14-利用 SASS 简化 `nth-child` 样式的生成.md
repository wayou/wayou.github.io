---
layout: post
title: "利用 SASS 简化 `nth-child` 样式的生成"
date: 2019-10-15 03:10:00 +0800
tags: 
---
    
# 利用 SASS 简化 `nth-child` 样式的生成

考察如下的 HTML 片段，通过 CSS 的 `nth-child()` 伪选择器实现列表的颜色循环，比如每三个一次循环。

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
  <li>6</li>
</ul>
```

很容易地，我们能得出如下样式代码：

```scss
ul {
  li:nth-child(3n + 1) {
    color: indigo;
  }
  li:nth-child(3n + 2) {
    color: red;
  }
  li:nth-child(3n + 3) {
    color: green;
  }
}
```

以上，只三种颜色循环，简单情况下可这样处理。但样式多起来之后，上面代码显得很臃肿且不易维护。

既然是使用 SASS，很容易想到可通过编写循环语句来将其简化。

循环过程就是遍历一个预设的颜色列表，为每一个颜色生成相应的样式。

## List & Map

首先需要定义一个对象来保存预设的颜色列表，SASS 中的 [Lists](https://sass-lang.com/documentation/values/lists) 可满足条件。

```scss
$colors: indigo, red, green;
```

使用上面的 list:

```scss
$colors: indigo, red, green;

@each $color in $colors {
  .color-#{$color} {
    color: $color;
  }
}
```

编译后输出：

```css
.color-indigo {
  color: indigo;
}

.color-red {
  color: red;
}

.color-green {
  color: green;
}
```

当然，也可以定义 [Map](https://sass-lang.com/documentation/values/maps) 类型，为每种颜色指定名字，这样使用的时候比较语义：

```scss
$colors: (
  "indigo": indigo,
  "red": red,
  "green": green
);

@each $name, $color in $colors {
  .color-#{$name} {
    color: $color;
  }
}
```

## 索引

列表对象及其遍历如上，现在还需要在遍历过程中获得一个 index 索引值，用于生成 `3*n+index`。

通过 `index()` 函数可以达到目的：

```scss
$colors: (indigo, red, green);

@each $color in $colors {
  $index: index($colors, $color);
  .color-#{$index} {
    color: $color;
  }
}
```

编译后输出：

```css
.color-1 {
  color: indigo;
}

.color-2 {
  color: red;
}

.color-3 {
  color: green;
}
```

## 生成 `nth-child` 样式

结合上面所有，可以得出生成 `nth-child` 样式的代码：

```scss
$colors: (indigo, red, green);

ul {
  @each $color in $colors {
    $index: index($colors, $color);
    li:nth-child(3n + #{$index}) {
      color: $color;
    }
  }
}
```

编译后输出：

```css
ul li:nth-child(3n + 1) {
  color: indigo;
}
ul li:nth-child(3n + 2) {
  color: red;
}
ul li:nth-child(3n + 3) {
  color: green;
}
```

注意到 `nth-child(3n + #{$index})` 中的 `3` 是硬编码。既然我们的颜色是在一个数组中，所以我们是知道总个数的，也就能替换掉这里硬编码的写法。

通过 `length()` 函数可获得 list 的长度。改进后的代码如下：

```scss
$colors: (indigo, red, green);

ul {
  @each $color in $colors {
    $index: index($colors, $color);
    li:nth-child(#{length($colors)}n + #{$index}) {
      color: $color;
    }
  }
}
```

这样，如果后续有颜色增加，或顺序的调整，我们只需要更新 `$colors` 变量的值即可。

## @mixin

进一步，我们可以将上面遍历生成 `nth-child` 的代码抽取成 mixin，这样可以被其他地方使用。

```scss
$colors: (indigo, red, green);

@mixin nth-color {
  @each $color in $colors {
    $index: index($colors, $color);
    li:nth-child(#{length($colors)}n + #{$index}) {
      color: $color;
    }
  }
}

ul {
  @include nth-color;
}
```

## mixin 的优化

但像上面这样还不能达到完全公用，因为 mixin 中使用了 `li` 选择器，不是所有需要 `nth-child` 样式的地方，都使用的 `li` 元素，所以此处需要进行优化，使得 mixin 中的这部分内容灵活一点，以适用不同的使用环境。

首先，使用 `&` 父选择器便可快速解决，这样生成的样式便由包含这个 mixin 的选择器决定了。

```scss
$colors: (indigo, red, green);

@mixin nth-color {
  @each $color in $colors {
    $index: index($colors, $color);
    &:nth-child(#{length($colors)}n + #{$index}) {
      color: $color;
    }
  }
}

ul {
  li {
    @include nth-color;
  }
}
```

诚然，这样修改过后，确实可以将该 mixin 使用于多个地方了。

但考虑这么一种情况，因为上面列表比较简单，更加常见的情况是，列表中是另外复杂的元素，而不是单纯的一个元素，比如像下面这样：

```html
<ul>
  <li>
    <div className="item">
      <h3>title</h3>
      <div>desc goes here...</div>
    </div>
  </li>
  <li>
    <div className="item">
      <h3>title</h3>
      <div>desc goes here...</div>
    </div>
  </li>
  <li>
    <div className="item">
      <h3>title</h3>
      <div>desc goes here...</div>
    </div>
  </li>
</ul>
```

现在想针对列表元素中的 `h3` 进行颜色的设置，即 `nth-child` 中设置的 `color` 只针对 `h3` 而不是整个 `li` 元素。

结合前面的优化，似乎可以这样写：

```diff
$colors: (indigo, red, green);

@mixin nth-color {
  @each $color in $colors {
    $index: index($colors, $color);
-    &:nth-child(#{length($colors)}n + #{$index}) {
+    &:nth-child(#{length($colors)}n + #{$index}) h3{
      color: $color;
    }
  }
}

ul {
  li {
    @include nth-color;
  }
}
```

编译后的结果：

```css
ul li:nth-child(3n+1) h3 {
  color: indigo;
}
ul li:nth-child(3n+2) h3 {
  color: red;
}
ul li:nth-child(3n+3) h3 {
  color: green;
}
```

从结果来看，达到了目标。但又在 `nth-color` 这个 mixin 中引入了 `h3`，使其变得不再通用，问题又回到了之前。

所以 `&` 只解决了 `nth-child` 父级嵌套的问题，对于 `nth-child` 后面还需要自定义选择器的情况，就需要用别的方式进一步优化。

## 给 `@mixin` 传参

mixin 是可以接收参数的，通过外部传递选择器进来，可以达到将 `h3` 从 mixin 从剥离的目的。

```scss
@mixin nth-color($child) {
  @each $color in $colors {
    $index: index($colors, $color);
    &:nth-child(#{length($colors)}n + #{$index}) #{$child}{
      color: $color;
    }
  }
}

ul {
  li {
    @include nth-color("h3");
  }
}
```

## 从 `@mixin` 将参数传递到外面

最后，`nth-color` 这个 mixin 还有一处不够灵活的地方，便是其样式内容。

现在在其中写死了只有一个 `color: $color;` 属性，也就是说，使用该 mixin 的地方只能用它来设置元素的字色。如果 mixin 能够将颜色传递出来，这样外部使用的时候就可以用到其他属性上，更加的灵活了。

SASS 确实也提供了这么种机制，即 mixin 能够身外传递参数，借助 [`@content`](https://sass-lang.com/documentation/at-rules/mixin#passing-arguments-to-content-blocks) 指令。

`@content` 指令指代调用 mixin 时书写的模式内容部分。如下的代码直观展示了其功能：

```diff
@mixin nth-color($child) {
  @each $color in $colors {
    $index: index($colors, $color);
    &:nth-child(#{length($colors)}n + #{$index}) #{$child}{
      color: $color;
+      @content;
    }
  }
}

ul {
  li {
-    @include nth-color("h3")
+    @include nth-color("h3"){
+      border:1px solid orange;
+    };
  }
}
```

编译后内容为：

```css
ul li:nth-child(3n+1) h3 {
  color: indigo;
  border: 1px solid orange;
}
ul li:nth-child(3n+2) h3 {
  color: red;
  border: 1px solid orange;
}
ul li:nth-child(3n+3) h3 {
  color: green;
  border: 1px solid orange;
}
```

可以看到，外部书写的 `border: 1px solid orange;` 通过 `@content` 指代而放进了每个 `nth-child` 样式中。只是这个 `border` 的颜色现在还是写死的 `orange`，现在来将其设置成跟随相应的字色，即跟着 `color` 属性走。

当我们使用 `@content(<arguments...>)` 形式的 `@content` 时，可以传递一些参数，外部调用该 mixin 时需要使用如下形式来获取传递的参数：

```
@include <name> using (<arguments...>)
```

**NOTE：**：这里的 [`using`](https://sass-lang.com/documentation/at-rules/mixin#passing-arguments-to-content-blocks) 语法只部分 SASS 实现（Dart Sass since 1.15.0, LibSass, Ruby Sass）中有支持，[node-sass](https://github.com/sass/node-sass) 还没有。

## 最终的 mixin

所以，最终版的代码为：

```scss
$colors: (indigo, red, green);

@mixin nth-color($child) {
  @each $color in $colors {
    $index: index($colors, $color);
    &:nth-child(#{length($colors)}n + #{$index}) #{$child} {
      color: $color;
      @content ($color);
    }
  }
}

ul {
  li {
    @include nth-color("h3") using($color) {
      border: 1px solid #{$color};
    }
  }
}
```

编译后得到的 CSS：

```css
ul li:nth-child(3n+1) h3 {
  color: indigo;
  border: 1px solid indigo;
}
ul li:nth-child(3n+2) h3 {
  color: red;
  border: 1px solid red;
}
ul li:nth-child(3n+3) h3 {
  color: green;
  border: 1px solid green;
}
```

## 总结

通过将生成 `nth-child` 样式的规则自动化的过程中，顺带使用了 SASS 中另外一些特性，

- 定义和使用数组及对象
- 数组及对象的遍历
- 遍历过程中索引的获取
- `@mixin` 的使用，参数的传递
- `@mixin` 中 `@content` 的使用
- `@mixin` 中向外传递参数

## 相关资源

- [:nth-child()](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child)
- [SASS documentation - Lists](https://sass-lang.com/documentation/values/lists)
- [SASS documentation - Maps](https://sass-lang.com/documentation/values/maps)
- [`@content`](https://sass-lang.com/documentation/at-rules/mixin#passing-arguments-to-content-blocks)

    