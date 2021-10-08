---
layout: post
title: "使用 Docker 部署 Node 应用"
date: 2021-06-18T12:53:08Z
---
# 使用 Docker 部署 Node 应用

容器将应用与环境打包整合，解决了应用外部依赖的痛点，打包后通过 Docker 可方便地部署到任意环境，用过就知道很香。

## 创建示例应用

以 [NestJS](https://nestjs.com/) 为例，先创建一个示例应用。

```sh
$ npm i -g @nestjs/cli
$ nest new my-app
$ cd my-app
$ yarn && yarn start
```

然后 app.controller.ts 中添加如下 action:

```ts
  @Get('ping')
  async ping() {
    return 'pong';
  }
```

测试一把会得到如下返回，证明我们的 app 一切正常：

```sh
$ curl localhost:3000/ping
pong
```


## Docker 介绍

先了解 Docker 的两个核心概念：

- [镜像/image](https://docs.docker.com/engine/reference/commandline/image/):  本质上是一个文件，里面包含创建容器的指令，可通过 `docker images` 查看已有的镜像。
- [容器/container](https://www.docker.com/resources/what-container): 通过镜像创建出来运行中的实例即容器，可通过 `docker ps` 命令查看运行中的容器。


## Docker 安装

```sh
$ brew install --cask docker
```

如果已经安装过，升级可使用如下命令：

```sh
$ brew install --cask docker
```

然后在程序目录或 Spotlight 中找到并启动 Docker，系统状态栏中会有个鲨鱼图标。


启动后命令行工具已经可用，检查安装：

```sh
$ docker —version
Docker version 20.10.6, build 370c289
```

## 使用

通过 `docker help` 查看帮助。

```sh
$ docker help
```

查看具体命令的帮助可在 `help` 后加上该命令：

```sh
$ docker help run
```

## 打包生成镜像

Docker 中打包后的应用存在于镜像中，其中便包含了应用及依赖的环境。将这个镜像文件进行分发就可以在其他地方加载运行，实现了在新环境中方便部署，无须再关心外部依赖。

### 创建 Dockerfile

使用 Docker 打包应用需先创建 [Dockerfile](https://docs.docker.com/engine/reference/builder/)，其中包含指导 Docker 如何打包的指令。

```sh
$ touch Dockerfile
```

一般我们会基于已有镜像来创建自己的镜像，比如这里打包 Node 应用，我们会使用一个已经包含 Node 环境的镜像作为源。通过如下 `FROM` 语句完成：

```sh
FROM node:14
```

创建应用所在的目录：

```sh
# Create app directory
WORKDIR /usr/src/app
```

将文件复制到目标路径，然后进行 npm 包依赖的安装：

```sh
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
```

复制应用中的源码文件：

```sh
# Bundle app source
COPY . .
```

依赖和源码都好后，可以编译 Nest 应用，生成 dist 目录了：

```sh
npm run build
```

可以把镜像看作一个封闭环境，外界要与其中的应用进行交互，比如这里打包的是 Nest 服务，要能正常访问 Nest 中我们编写的 HTTP 接口，就需要 image 向外暴露端口。

因为默认 Nest 应用起的 3000 端口，这里就将其暴露，

```sh
EXPOSE 3000
```

最后一条指令，指导 Docker 启动 Nest 应用：

```sh
CMD [ "node", "dist/main" ]
```

所以完整的 Dockerfile 目前长这样了：

```sh
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
npm run build

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "dist/main" ]
```

### `.dockerignore` 文件

可创建 `.dockerignore` 文件，将日志，本地无用文件排除在复制的文件列表之外。

```sh
node_modules
npm-debug.log
```

### 生成镜像

通过如下命令根据前面创建的 Dockerfile 生成镜像：

```sh
$ docker build . -t wayou/my-app
```

其中 `-t` 指定镜像名称，一般为 `<username>/<image_name>` 形式，其中 `username` 与你在 Docker Hub 中的用户名一致。前面提到镜像可进行分发，当然也能分享，同时我们的 Dockerfile 也是基于名为 `node:14` 的镜像进行创建的，Docker Hub 则是官方一个分享 image 的平台。

生成镜像过程中如果出现如下错误：

```sh
Error response from daemon: dial unix docker.raw.sock: connect: connection refused
```

重启一下 Docker 服务即可。


### 查看镜像

正常的话，可通过如下命令查看到刚刚生成的镜像：

```sh
$ docker images
REPOSITORY            TAG       IMAGE ID       CREATED       SIZE
wayou/my-app   latest    6ba2f1f74d8b   7 hours ago   1.44GB
```

### 运行镜像

通过如下命令运行镜像：

```sh
$ docker run -p 8000:3000 -d wayou/my-app
```

其中 `-p` 部分前面为外部环境使用的端口，而 3000 为容器对外 暴露的端口。实际使用时则是使用外部这个 8000。

```sh
$ curl localhost:8000/ping
pong
```

通过 `docker ps` 查看运行中的实例。

### 镜像启动失败的排查

这里展示下如下 Debug 找出镜像启动失败的原因，即没有生成运行中的容器。

前面启动应用的指令是 `CMD [ "node", "dist/main" ]`，而 `dist` 目录是通过 `npm run build` 而来，假如我们的 Dockerfile 中没有 build 这个步骤，很明显就没有 `dist` 目录所以会导致应用启动失败。

启动失败的话，`docker ps` 输出为空。

此时可加上 `-a` 参数，它会列出所有容器，包含停止的实例，以查看其状态。

```sh
$ docker ps -a
```

如果看到 `STATUS` 为 `Exited`，原因就是启动失败了。此时需要 Debug 一下看看启动失败的具体原因。

重新启动，并指定名称，方便后面查看日志：

```sh
$ docker run -p 8000:3000 -d --name test wayou/my-app
```

现在查看时可能看一个指定名称为 `test` 的容器：

```sh
$ docker ps -a                                                                                                                                                                                                         
CONTAINER ID   IMAGE                 COMMAND                  CREATED             STATUS                      PORTS     NAMES
a9d187c0d665   wayou/my-app   "docker-entrypoint.s…"   5 seconds ago       Exited (1) 3 seconds ago              test
```

然后通过 [docker logs](https://docs.docker.com/engine/reference/commandline/logs/) 查看其日志：


```sh
$ docker logs -t test                                                                                                                                                                                                   
2021-05-21T09:58:56.706680291Z internal/modules/cjs/loader.js:888
2021-05-21T09:58:56.706727664Z   throw err;
2021-05-21T09:58:56.706735472Z   ^
2021-05-21T09:58:56.706739801Z
2021-05-21T09:58:56.706743086Z Error: Cannot find module '/usr/src/app/node dist/main'
2021-05-21T09:58:56.706746265Z     at Function.Module._resolveFilename (internal/modules/cjs/loader.js:885:15)
2021-05-21T09:58:56.706751604Z     at Function.Module._load (internal/modules/cjs/loader.js:730:27)
2021-05-21T09:58:56.706755609Z     at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
2021-05-21T09:58:56.706759645Z     at internal/main/run_main_module.js:17:47 {
2021-05-21T09:58:56.706762133Z   code: 'MODULE_NOT_FOUND',
2021-05-21T09:58:56.706764372Z   requireStack: []
2021-05-21T09:58:56.706766508Z }
```

从日志中就清晰地看到原因了。

修正后成功运行的话，通过 `docker ps` 看到正常运行的容器了。

```sh
$ docker ps         
CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS                                       NAMES
743cb8b9d604   wayou/my-app   "docker-entrypoint.s…"   5 seconds ago   Up 3 seconds   0.0.0.0:8000->3000/tcp, :::8000->3000/tcp   test
```

### 镜像及容器的清除

调试过程难免会生成很多无用的测试数据，可通过如下命令进行清除。

#### 单个清除

通过各自对应的 `rm` 命令来完成。

[镜像的删除](https://docs.docker.com/engine/reference/commandline/image_rm/)：

```sh
$ docker image rm [OPTIONS] IMAGE [IMAGE...]
```

[容器的删除](https://docs.docker.com/engine/reference/commandline/rm/)：

```sh
$  docker rm [OPTIONS] CONTAINER [CONTAINER...] 
```

#### 批量清除

也可通过 [`docker container prune`](https://docs.docker.com/config/pruning/) 将全部容器清除掉。


### 进入容器内

通过如下命令可在容器中开启一个 shell，在 shell 中可查看其中的文件等。

```sh
$ docker exec -it <container id> /bin/bash
```



## 相关资源

- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) 
- [Using Docker and Yarn for Development](https://shemleong.medium.com/using-docker-and-yarn-for-development-2546e567ad2)
- [Docker on Mac with Homebrew: A Step-by-Step Tutorial](https://www.cprime.com/resources/blog/docker-on-mac-with-homebrew-a-step-by-step-tutorial/)
- [Cannot connect to the Docker daemon on macOS](https://stackoverflow.com/a/44719239/1553656)
- [Run container but exited immediately](https://forums.docker.com/t/run-container-but-exited-immediately/18811)
- [Docker look at the log of an exited container](https://stackoverflow.com/a/36666348/1553656)
- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
- [How We Reduce Node Docker Image Size In 3 Steps](https://medium.com/trendyol-tech/how-we-reduce-node-docker-image-size-in-3-steps-ff2762b51d5a)
- [Use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)

