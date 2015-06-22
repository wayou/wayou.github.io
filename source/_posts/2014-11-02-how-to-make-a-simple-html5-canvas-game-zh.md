title: 如何开发一个简单的HTML5 Canvas 小游戏
toc: true
categories: 技术 
date: 2014-11-02 13:14:34
tags:
- HTML5
- Canvas
- 游戏
- 前端
---

> 原文：[How to make a simple HTML5 Canvas game](http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/)

想要快速上手HTML5 Canvas小游戏开发？下面通过一个例子来进行手把手教学。（如果你怀疑我的资历， [A Wizard's Lizard](http://www.wizardslizard.com/)这个游戏的半数以上开发是由我完成的）

<!-- more -->

我们直接来看源码里的[game.js](https://github.com/lostdecade/simple_canvas_game/blob/master/js/game.js),当然你也可以[在线体验](http://www.lostdecadegames.com/demos/simple_canvas_game/)一下游戏先。

# 游戏截图

![游戏截图](/asset/posts/how-to-make-a-simple-html5-canvas-game-zh/screenshot.jpg)

# 创建画布

```js
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
```

首先我们需要创建一张[画布](https://developer.mozilla.org/en/canvas_tutorial)作为游戏的舞台。这里通过JS代码而不是直接在HTML里写一个`<canvas>`元素目的是要说明代码创建也是很方便的。有了画布后就可以获得它的上下文来进行绘图了。然后我们还设置了画布大小，最后将其添加到页面上。

# 准备图片

```js
// 背景图片
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";
```

游戏嘛少不了图片的，所以我们先加载一些图片先。简便起见，这里仅创建简单的图片对象，而不是专门写一个类或者Helper来做图片加载。`bgReady `这个变量用来标识图片是否已经加载完成从而可以放心地使用了，因为如果在[图片加载未完成情况下进行绘制是会报错](http://stackoverflow.com/questions/2923564/uncaught-error-index-size-err)的。

整个游戏中需要用到的三张图片：[背景](https://github.com/lostdecade/simple_canvas_game/blob/master/images/background.png)，[英雄](https://github.com/lostdecade/simple_canvas_game/blob/master/images/hero.png)及[怪物](https://github.com/lostdecade/simple_canvas_game/blob/master/images/monster.png)我们都用上面的方法来处理。

# 游戏对象

```js
// 游戏对象
var hero = {
    speed: 256, // 每秒移动的像素
    x: 0,
    y: 0
};
var monster = {
    x: 0,
    y: 0
};
var monstersCaught = 0;
```

现在定义一些对象将在后面用到。我们的`英雄`有一个`speed`属性用来控制他每秒移动多少像素。`怪物`游戏过程中不会移动，所以只有坐标属性就够了。`monstersCaught `则用来存储怪物被捉住的次数。

# 处理用户的输入

```js
// 处理按键
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);
```

现在开始处理用户的输入(对初次接触游戏开发的前端同学来说，这部分开始可能就需要一些脑力了)。在前端开发中，一般是用户触发了点击事件然后才去执行动画或发起异步请求之类的，但这里我们希望游戏的逻辑能够更加紧凑同时又要及时响应输入。所以我们就把用户的输入先保存下来而不是立即响应。

为此，我们用`keysDown`这个对象来保存用户按下的键值(`keyCode`)，如果按下的键值在这个对象里，那么我们就做相应处理。

# 开始一轮游戏

```js
// 当用户抓住一只怪物后开始新一轮游戏
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // 将新的怪物随机放置到界面上
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};
```

`reset `方法用于开始新一轮和游戏，在这个方法里我们将英雄放回画布中心同时将怪物放到一个随机的地方。

# 更新对象

```js
// 更新游戏对象的属性
var update = function (modifier) {
    if (38 in keysDown) { // 用户按的是↑
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // 用户按的是↓
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // 用户按的是←
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // 用户按的是→
        hero.x += hero.speed * modifier;
    }

    // 英雄与怪物碰到了么？
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }
};
```

这就是游戏中用于更新画面的`update`函数，会被规律地重复调用。首先它负责检查用户当前按住的是中方向键，然后将英雄往相应方向移动。

有点费脑力的或许是这个传入的`modifier` 变量。你可以在`main` 方法里看到它的来源，但这里还是有必要详细解释一下。它是基于1开始且随时间变化的一个因子。例如1秒过去了，它的值就是1，英雄的速度将会乘以1，也就是每秒移动256像素；如果半秒钟则它的值为0.5，英雄的速度就乘以0.5也就是说这半秒内英雄以正常速度一半的速度移动。理论上说因为这个`update` 方法被调用的非常快且频繁，所以`modifier`的值会很小，但有了这一因子后，不管我们的代码跑得快慢，都能够保证英雄的移动速度是恒定的。

现在英雄的移动已经是基于用户的输入了，接下来该检查移动过程中所触发的事件了，也就是英雄与怪物相遇。这就是本游戏的胜利点，`monstersCaught` +1然后重新开始新一轮。

# 渲染物体

```js
// 画出所有物体
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // 计分
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
};
```

之前的工作都是枯燥的，直到你把所有东西画出来之后。首先当然是[把背景图画出来](https://developer.mozilla.org/en/Canvas_tutorial/Using_images)。然后如法炮制将英雄和怪物也画出来。这个过程中的顺序是有讲究的，因为后画的物体会覆盖之前的物体。

这之后我们改变了一下`Canvas`的绘图上下文的样式并调用`fillText `来绘制文字，也就是记分板那一部分。本游戏没有其他复杂的动画效果和打斗场面，绘制部分大功告成！

# 主循环函数

```js
// 游戏主函数
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // 立即调用主函数
    requestAnimationFrame(main);
};
```

上面的主函数控制了整个游戏的流程。先是拿到当前的时间用来计算时间差（距离上次主函数被调用时过了多少毫秒）。得到`modifier`后除以1000(也就是1秒中的毫秒数)再传入`update`函数。最后调用`render` 函数并且将本次的时间保存下来。

关于游戏中循环更新画面的讨论可参见「[ Onslaught! Arena Case Study](http://www.html5rocks.com/en/tutorials/casestudies/onslaught.html#toc-the-game-loop)」。

# 关于循环的进一步解释

```js
// requestAnimationFrame 的浏览器兼容性处理
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
```

*如果你不是完全理解上面的代码也没关系，我只是觉得拿出来解释一下总是极好的*

为了循环地调用`main`函数，本游戏之前用的是`setInterval`。但现今已经有了更好的方法那就是`requestAnimationFrame`。使用新方法就不得不考虑浏览器兼容性。上面的[垫片](https://en.wikipedia.org/wiki/Polyfill)就是出于这样的考虑，它是[Paul Irish 博客原版](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)的一个简化版本。

# 启动游戏！

```js
// 少年，开始游戏吧！
var then = Date.now();
reset();
main();
```

总算完成了，这是本游戏最后一段代码了。先是设置一个初始的时间变量`then`用于首先运行`main`函数使用。然后调用 `reset` 函数来开始新一轮游戏（如果你还记得的话，这个函数的作用是将英雄放到画面中间同时将怪物放到随机的地方以方便英雄去捉它）。

到此，相信你已经掌握了开发一个简单H5小游戏需要的基本功了。[玩玩这个游戏](http://www.lostdecadegames.com/demos/simple_canvas_game/)或者[下载代码](https://github.com/lostdecade/simple_canvas_game)自己研究研究吧 :)

