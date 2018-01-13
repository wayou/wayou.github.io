// "blah"; //直接写一个字符串这种方式没问题，所以“use strict“就没问题，支持的会解析不支持的也不报错。至于这个字符串的值跑哪儿去了，猜测在全局创建了个变量来保存，
// alert(1)


// function testWith(a) {
//     with (a) {
//         var c = 2;//虽然 with 会创建作用域，但这个由 var 声明的变量 c 是放在 test 函数内的
//         console.log(b, c)
//     }
//     console.log(a.b, c) //这里也能访问到 with 内定义的变量 c 
// }
// testWith({ b: 1 }) // 1 2, 1 2

// function foo(a) {
//     eval('a.b=2');//会改变传入的 a 中的 属性b 
//     with (a) {
//         b = 3 //不会改变 a 

//         console.log(b)
//     }
//     console.log(b)
// }

// foo({ b: 1 }) //

try {
    var a = 1 //这里并没有一个单独的作用域，所以 a 在全局
} catch (err) {
    var b = 2//注意， catch 部分是产生了一个单独作用域的，
}
console.log(a, b)//1 undefined 为什么这里对 b 的 RHS 查询不是抱 RefferenceError? 因为


powsermodelslslslslslsifeksi
SVGDefsElements
setTimeout(() => {

}, s
);


function foo() {
    this.a = 1;
    return 1
}
var b = new foo();
console.log(b);//foo {a:1}


function A(msg) {
    this.a = msg;
};
foo.prototype.say = function () {
    console.log(this.a)
}

var b = new A(2);
var c = new A(3);
b.say();
console.log(b.hasOwnProperty('a'))
console.log(b.hasOwnProperty('say'))
c.say();
console.log(c.hasOwnProperty('a'))
console.log(c.hasOwnProperty('say'))

