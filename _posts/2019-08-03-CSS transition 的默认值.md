---
layout: post
title: "CSS transition 的默认值"
date: 2019-08-03 22:08:00 +0800
tags: 
---
    
# CSS transition 的默认值

## 语法

```
transition: property duration timing-function delay|initial|inherit;
```

示例：

```css
div {
  width: 100px;
  height: 100px;
  transition: width 2s;
}

div:hover {
  width: 300px;
}
```

![transition mov](https://user-images.githubusercontent.com/3783096/62132263-4c730b00-b30f-11e9-8434-dd149d72f863.gif)
<p align="center">CSS transition 演示</p>


## 同时指定多个属性

也可同时指定多个需要 `transition` 的属性，每个属性用逗号分隔，包含自己完整的时间，动画方法（timing function）的指定。

```css

div {
  width: 100px;
  height: 100px;
  transition: width,height 2s;
}

div:hover {
  width: 300px;
  height: 300px;
}

```

![transition_multi_props mov](https://user-images.githubusercontent.com/3783096/62132304-6280cb80-b30f-11e9-9017-303e4ef4fecc.gif)
<p align="center">CSS transition 同时作用于多个属性 </p>


上面 `width` 只指定了属性，未指定时间及动画方法，所以动作的变化发是在瞬时完成的。

## 默认值

```css
transition: all 0s ease 0s
```

意味着浏览器对所有元素所有属性设置了 transitoin 但时长为 0。

所以实际使用中，只需要设置元素的 `transition-duration` 即可让 `transition` 生效。

```diff
div {
  width: 100px;
  height: 100px;
-  transition: width,height 2s;
+  transition-duration: 2s;
}

div:hover {
  width: 300px;
  height: 300px;
}

```

![defualt mov](https://user-images.githubusercontent.com/3783096/62132377-8ba15c00-b30f-11e9-84f0-38b9f78c3f44.gif)
<p align="center">CSS transition 的默认值</p>


## 相关资料

- [Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
- [Set a CSS3 transition to none](https://stackoverflow.com/a/41140206/1553656)
- [w3schools - CSS transition Property](https://www.w3schools.com/cssref/css3_pr_transition.asp)

    