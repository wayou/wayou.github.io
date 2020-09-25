---
layout: post
title: "TypeScript 装饰器 "
date: 2019-05-30 23:05:00 +0800
tags: 
---
    
# TypeScript 装饰器

装饰器（[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)）可用来装饰类，属性，及方法，甚至是函数的参数，以改变和控制这些对象的表现，获得一些功能。

装饰器以 `@expression` 形式呈现在被装饰对象的前面或者上方，其中 `expression` 为一个函数，根据其所装饰的对象的不同，得到的入参也不同。

以下两种风格均是合法的：

```ts
@f @g x
```

```ts
@f
@g
x
```

ES 中装饰器处于 [Stage 2 阶段](https://github.com/tc39/proposal-decorators) ，TypeScript 中通过开启相应编译开关来使用。

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

## 一个简单的示例

一个简单的示例，展示了 TypeScript 中如何编写和使用装饰器。

```ts
function log(
  _target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function() {
    console.log(`method ${propertyKey} called`);
    return originalMethod.apply(this, arguments);
  };
}

class Test {
  @log
  static sayHello() {
    console.log("hello");
  }
}

Test.sayHello();
```

上面的示例中，创建了名为 `log` 的方法，它将作为装饰器作用于类的方法上，在方法被调用时输出一条日志。作为装饰器的 `log` 函数其入参在后面会介绍。

执行结果：

```sh
method sayHello called
hello
```

## 装饰器的工厂方法

上面的装饰器比较呆板，设想我们想将它变得更加灵活和易于复用一些，则可以通过创建一个工厂方法来实现。因为本质上装饰器就是个普通函数，函数可通过另外的函数来创建和返回，同时装饰器的使用本质上也是一个函数调用。通过传递给工厂方法不同的参数，以获得不同表现的装饰器。

```ts
function logFactory(prefix: string) {
  return function log(
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      console.log(`method ${propertyKey} called`);
      return originalMethod.apply(this, arguments);
    };
  };
}

class Test {
  @logFactory("[debug]")
  static sayHello() {
    console.log("hello");
  }
  @logFactory("[info]")
  static sum() {
    return 1 + 1;
  }
}

Test.sayHello();
Test.sum();
```

执行结果：

```sh
[debug] method sayHello called
hello
[info] method sum called
```

## 多个装饰器

多个装饰器可同时作用于同一对象，按顺序书写出需要运用的装饰器即可。其求值（evaluate）和真正被执行（call）的顺序是反向的。即，排在前面的先求值，排在最后的先执行。

譬如，

```ts
function f() {
  console.log("f(): evaluated");
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("f(): called");
  };
}

function g() {
  console.log("g(): evaluated");
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("g(): called");
  };
}

class C {
  @f()
  @g()
  method() {}
}
```

**求值** 的过程就体现在装饰器可能并不直接是一个可调用的函数，而是一个工厂方法或其他表达式，只有在这个工厂方法或表达式被求值后，才得到真正被调用的装饰器。

所以在这个示例中，先依次对 `f()` `g()` 求值，再从 `g()` 开始执行到 `f()`。

运行结果：

```sh
f(): evaluated
g(): evaluated
g(): called
f(): called
```

## 不同类型的装饰器

### 类的装饰器

作用于类（Class）上的装饰器，用于修改类的一些属性。如果装饰器有返回值，该返回值将替换掉该类的声明而作为新的构造器使用。

装饰器入参：

- 类的构造器。

示例：

```ts
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

`@sealed` 将类进行密封，将无法再向类添加属性，同时类上属性也变成不可配置的（non-configurable）。

另一个示例：

```ts
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

console.log(new Greeter("world"));
```

因为 `@classDecorator` 中有返回值，这个值将替换本来类的定义，当 `new` 的时候，使用的是装饰器中返回的构造器来创建类。

### 方法的装饰器

装饰器作用于类的方法时可用于观察，修改或替换该方法。如果装饰器有返回值，将替换掉被作用方法的属性描述器（[roperty Descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)）。

装饰器入参依次为：

- 作用于静态方法时为类的构造器，实例方法时为类的原型（prototype）。
- 被作用的方法的名称。
- 被作用对象的属性描述器。

示例：

```ts
function enumerable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

上面示例中 `@enumerable` 改变了被装饰方法的 `enumerable` 属性，控制其是否可枚举。

类的方法可以是设置器（setter）或获取器（getter）。当两者成对出现时，应当只对其中一个运用装饰器，谁先出现就用在谁身上。因为装饰器应用时是用在 `get` 和 `set` 两者合并的属性描述器上的。

```ts
class Test {
  private _foo = 1;
  @logFactory("[info]")
  get foo() {
    return this._foo;
  }
  //🚨 Decorators cannot be applied to multiple get/set accessors of the same name.ts(1207)
  @logFactory("[info]")
  set foo(val: number) {
    this._foo = val;
  }
}
```

### 属性的装饰器

作用于类的属性时，其入参依次为：

- 如果装饰的是静态属性则为类的构造器，实例属性则为类的原型
- 属性名

此时并没有提供第三个入参，即该属性的属性描述器。因为定义属性时，没有相应机制来描述该属性，同时属性初始化时也没有方式可以对其进行修改或观察。

如果装饰器有返回值，将被忽略。

因此，属性装饰器仅可用于观察某个属性是否被创建。

一个示例：

```ts
function logProperty(target: any, key: string) {
  // property value
  var _val = this[key];

  // property getter
  var getter = function() {
    console.log(`Get: ${key} => ${_val}`);
    return _val;
  };

  // property setter
  var setter = function(newVal) {
    console.log(`Set: ${key} => ${newVal}`);
    _val = newVal;
  };

  // Delete property.
  if (delete this[key]) {
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  }
}

class Person {
  @logProperty
  public name: string;
  public surname: string;

  constructor(name: string, surname: string) {
    this.name = name;
    this.surname = surname;
  }
}

var p = new Person("remo", "Jansen");
p.name = "Remo";
var n = p.name;
```

这个示例中，通过将原属性删除，创建带设置器和获取器的同名属性，来达到对属性值变化的监听。注意此时操作的已经不是最初那个属性了。

运行结果：

```sh
Set: name => remo
Set: name => Remo
Get: name => Remo
```

### 参数的装饰器

装饰器也可作用于方法的入参，这个方法不仅限于类的成员方法，还可以是类的构造器。装饰器的返回值会被忽略。

当作用于方法的参数时，装饰器的入参依次为：

- 如果装饰的是静态方法则为类的构造器，实例方法则为类的原型。
- 被装饰的参数名。
- 参数在参数列表中的索引。

比如，定义一个参数为必传的：

```ts
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey
  );
}

function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>
) {
  let method = descriptor.value;
  descriptor.value = function() {
    let requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName
    );
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          arguments[parameterIndex] === undefined
        ) {
          throw new Error("Missing required argument.");
        }
      }
    }

    return method.apply(this, arguments);
  };
}

class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  @validate
  greet(@required name: string) {
    return "Hello " + name + ", " + this.greeting;
  }
}
```

上面示例中，`@required` 将参数标记为必需，配合 `@validate` 在调用真实的方法前进行检查。



## 相关资源

- [TypeSdript Handbook - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [GitHub Gist - decorators](https://gist.github.com/remojansen/16c661a7afd68e22ac6e)

    