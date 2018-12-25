### JS 中创建给定长度的数组

最佳直观的方式莫非使用字面量。

````js
const arr = [1,2,3];
``

缺点很明显，元素多的时候就捉襟见肘了。我们需要更加便捷地创建给定长度的数组。

首先了解下，数组以数组的形式存在时，其存储和读取是非常高效的，也就是说，数组还有以非数组的形式存在的情况。

与其他语言中数组是连续元素组成的数据类型不同，JS 中数组序列中是允许存在间隔，即数组中可以有「洞」。

```js
const arr_with_hole = [1,,2];
// arr_with_hole[1] => undefined
````

注意这里之所以说数组存在洞，而不是说空的地方是 `undefined`，是因为 `undefined` 是实实在在的数据类型，而数组中存在洞的地方，其并不是被初始化了一个实实在在的 `undefined`，而是只有我们在访问的时候，才得到了一个确切的 `undefined` 值。联想薛定谔的猫。

此时 V8 引擎中其不是以数组形式存在，而是一个以数字为键的键值对。对该数据的操作是没有正规数组那样高效的。且一旦有洞，后续将数组补全也无法恢复到真实的数组。也就是说，这个性能的损失是不可挽回的。

所以，JS 中尽量避免创建不连续数组。

另外，如果元素全为数字的数组操作起来性能会好些。

### 数组构造器

通过数组构造器可以很方便地创建指定长度的数组。

```js
const arr = new Array(3);
// arr => [empty × 3]
// arr[1] => undefined
```

如你所见，这个数组全是洞。尝试访问其元素将会得到 `undefined`。所以，

- 其性能差
- `undefined` 不是一个友好的初始值

如果为了解决初始值的问题，数组身上的 `fill()` 方法能派上用场。

```js
const arr = new Array(3).fill(0);
// arr => [0,0,0]
// arr.fill('hello') => ['hello','hello','hello']
```

_注意_：如果使用对象填充数组，数组所有元素指向的是同一对象。这点不难理解，但是很坑爹。

```js
const arr = new Array(3).fill({});
arr[0].name = "张三";
// a[1] => {name:'张三'}
```

### 使用循环

既然字面量方式无法满足任意长度的情况，那明直接的办法就是 `for` 循环了。

```js
const NUM = 3;
const arr = [];
for (let i = 0; i < NUM; i++) {
  arr.push(0);
}
// arr => [0,0,0]
```

此种方式创建的数组没有洞，原生高效，但创建过程并不高效，因为在内部实现上，每次元素的添加都需要重新分配空间。

### `Array.from`

`Array.from` 可以从数组创建数组。特别地，它可以将类数组（array-like）转成真·数组。

类数组最著名代表人物有:

- 函数内部获取到的参数对象 `arguments`，
- `document.querSelector('p')` 返回的 DOM 节点列表

类数组只是呈现上像数组，因为是假的，其身上并没有数组该有的原型方法比如 `sort()`，`filter()`。

`Array.from` 也会将数组中薛定谔的洞塌缩成具体的值，于是我们可以通过它轻松得到一个全是 `undefined` 的数组。

```js
Array.from(new Array(3)); // [undefined,undefined,undefined]
```

此外，`.from()` 可以传递一个 `map` 方法作为第二个参数，这样在创建新数组时会运用上这个映射函数。

```js
Array.from(new Array(3), (v, i) => i); // [0,1,2]
Array.from(new Array(3), () => "矢泽妮可"); // ['矢泽妮可','矢泽妮可','矢泽妮可']
```

_Bonus_

若不真的看见，我大概不会相信还可以这样操作：

```js
Array.from({ length: 3 }, () => "矢泽妮可"); // ['矢泽妮可','矢泽妮可','矢泽妮可']
```

缘何上面的代码也能给我们三个可爱的「矢泽妮可」。魔法在于 `{length: 3}` 被当作类数组处理了，天秀！


### `keys()`

`keys()` 返回 iterable，通过将其解构可以得到数组：

```js
[...new Array(3).keys()]; // [ 0, 1, 2 ]
```

### Tips

- 关注代码的可读性而不是微小的性能差异，因为现今的 JS 引擎可以很好地处理性能了
- 如果处理的是大量数字类型的数组，使用 [`Typed Arrays`](http://exploringjs.com/es6/ch_typed-arrays.html)


### 参考

- [Creating and filling Arrays of arbitrary lengths in JavaScript](http://2ality.com/2018/12/creating-arrays.html#cheat-sheet-creating-arrays)
