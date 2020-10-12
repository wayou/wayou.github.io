---
layout: post
title: "RabbitMQ Node.js 示例"
date: 2019-05-04 21:05:00 +0800
tags: 
---
    
RabbitMQ Node.js 示例
===

RabbitQM 处理和管理消息队列的中间人（broker）。可简单理解为邮局，你在程序中写好消息，指定好收件人，剩下的事件就是 RabbitMQ 的工作了，它会保证收件人正确收到邮件。

任何发送邮件的程序都是 `Producer`，消息队列可理解为邮筒，新件将堆积在此处。所有待处理的消息都以队列形式存储，总体上看来就是一个巨大的消息 buffer，至于存储量与设置的内存及硬件有关。任何应用都可以向队列添加消息，也可以多个消费者都在从队列中获取消息。

而 `consumer` 即是消息队列中消息的应用，其处于等待接收来自 RabbitMQ 发送来的消息。

消息生产者，消费者及 RabbitMQ 这个中间人三者不必同时存在于同一机器上，实际运用时也确实大部分不会部署在同一机器上，比如有专门的机器作为 RabbitMQ 实体，而应用程序会部署在其他的集群。应用程序可以是同时负责生产消息的，也同时是消费者。

<p align="center"><img alt="来自官方文档中关于 RabbitMQ 消息列队的示意图" src="https://www.rabbitmq.com/img/tutorials/python-one.png" /></p>
<p align="center">来自官方文档中关于 RabbitMQ 消息列队的示意图</p>

## 安装

通过[官网提供的地址](https://www.rabbitmq.com/download.html)下载相应平台的程序进行安装，Mac 可通过 [Homebrew 进行安装](https://www.rabbitmq.com/install-homebrew.html)：

```sh
$ brew update && brew install rabbitmq
```

## 启动

如果使用 Homebrew 安装，可通过 `brew services start rabbitmq` 命令来启动 RabbitMQ 服务。

```sh
$ brew services start rabbitmq
==> Successfully started `rabbitmq` (label: homebrew.mxcl.rabbitmq)
```

或直接运行 `/usr/local/sbin/rabbitmq-server`。

启动后，会有一个可视化的管理后台，可通过 [http://localhost:15672/](http://localhost:15672/) 访问，用户名密码皆为 `guest`。

## 基于 Node.js 的 Hello World 示例

通过 [amqp.node](https://github.com/squaremo/amqp.node) 展示 RabbitMQ 在 Node.js 中应用的一个示例。

RabbmitMQ 支持多种协议进行通信，amqp.node 使用的是 AMQP 0-9-1 这一开源协议，后者专门为处理消息而设计。作为客户端消费消息，使用的是 [amqp.node client](http://www.squaremobius.net/amqp.node/) 模块，但 RabbitMQ 本身是支持多种[客户端](http://rabbitmq.com/devtools.html)的。

初始化一个 Node,js 项目然后通过以下命令安装 amqp.node 模块：

```sh
$ mkdir rabbitmq-demo && yarn init -y
$ yarn add amqplib
```

### 发送消息

创建 `send.js` 文件，在其中编写发送消息的逻辑，它将连接到 RabbitMQ 发送消息然后退出。


首先建立到 RabbitMQ 服务的连接，

```js
#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(error0, connection) {});
```

连接建立成功后，创建一个通道（channel），具体的发送将会在这个通道中进行。

```js
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {});
});
```

发送消息前，需要先声明一个队列，然后将消息发送到该队列：

```js
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'hello';
    var msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});
```

队列的创建是一个[幂等操作](https://stackoverflow.com/questions/1077412/what-is-an-idempotent-operation)，只该队列不存在的情况才会新建。

最后关闭连接并退出。

```js
setTimeout(function() {
    connection.close();
    process.exit(0);
}, 500);
```


<details>
<summary>
完整的 send.js
</summary>

```js
#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';
        var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
```

</details>

### 接收消息

下面开始编写消费者，消费者做的事情是监听来自 RabbitMQ 的消息并处理。

创建 `receive.js`，引入 amqp.node 模块，流程和发送者一样，也是先创建连接，然后创建通道，在通道中声明需要监听的队列：

```js
#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'hello';

    channel.assertQueue(queue, {
      durable: false
    });
  });
});
```

这里的队列声明不会与发送者那边的冲突，因为上面提到过，队列只在不存在的情况下才会重新生成。这里再次声明可以保证监听前队列已经存在。并且实际场景下，消费者有可能是在发送者之前启动的。

然后添加监听的逻辑：

```js
 console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

channel.consume(queue, function(msg) {
    console.log(" [x] Received %s", msg.content.toString());
}, {
    noAck: true
});
```

<details>
<summary>
完整的 receive.js
</summary>

```js

#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});
```

</details>

### 运行

分别在命令行启动上面两个程序，查看打印的信息。

```sh
$ node send.js
 [x] Sent Hello World!

$ node receive.js
 [*] Waiting for messages in hello. To exit press CTRL+C
 [x] Received Hello World!
```

另外，可通过 `sudo rabbitmqctl list_queues` 手动查看 RabbitMQ 中的消息。

```sh
$ /usr/local/sbin/rabbitmqctl list_queues
Timeout: 60.0 seconds ...
Listing queues for vhost / ...
name	messages
hello	0
```

如果发现 `rabbitmqctl` 命令不可用，需要添加 `/usr/local/sbin` 到环境变量中，

```sh
export PATH=/usr/local/sbin:$PATH
```

其中 fish shell 通过添加如下命令到 fish 的配置文件即可：

```bash
set -gx PATH /usr/local/sbin $PATH
```


## 相关资源

- [RabbitMQ Introduction](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
- [Node.js code for RabbitMQ tutorials](https://github.com/rabbitmq/rabbitmq-tutorials/tree/master/javascript-nodejs)
- [squaremo/amqp.node](https://github.com/squaremo/amqp.node)


    