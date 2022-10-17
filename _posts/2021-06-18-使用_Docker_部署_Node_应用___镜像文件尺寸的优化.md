---
layout: post
title: "使用 Docker 部署 Node 应用 - 镜像文件尺寸的优化"
date: 2021-06-18T13:15:21Z
---
# 使用 Docker 部署 Node 应用 - 镜像文件尺寸的优化

前面 [使用 Docker 部署 Node 应用](https://github.com/wayou/wayou.github.io/issues/281) 一文中完成了镜像的创建和运行，不过生成的镜像还有些粗糙，需要进一步优化。

## 镜像的优化

通过 `docker images` 看到简单的一个 node 服务端应用，超过 1G 大小，因此需要优化一下使其更加轻量。

通过如下命令查看镜像文件里都有什么文件以及分别占用的空间大小：

```sh
$ docker history --human --format "{{.CreatedBy}}: {{.Size}}" wayou/my-app 
CMD ["node" "dist/main"]: 0B
EXPOSE map[3000/tcp:{}]: 0B
COPY . . # buildkit: 2.24MB
RUN /bin/sh -c yarn build # buildkit: 118B
RUN /bin/sh -c yarn install --frozen-lockfil…: 484MB
RUN /bin/sh -c curl -o- -L https://yarnpkg.c…: 7.59MB
COPY package.json yarn.lock ./ # buildkit: 271kB
WORKDIR /usr/src/app: 0B
/bin/sh -c #(nop)  CMD ["node"]: 0B
/bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…: 0B
/bin/sh -c #(nop) COPY file:238737301d473041…: 116B
/bin/sh -c set -ex   && for key in     6A010…: 7.76MB
/bin/sh -c #(nop)  ENV YARN_VERSION=1.22.5: 0B
/bin/sh -c ARCH= && dpkgArch="$(dpkg --print…: 100MB
/bin/sh -c #(nop)  ENV NODE_VERSION=14.17.0: 0B
/bin/sh -c groupadd --gid 1000 node   && use…: 333kB
/bin/sh -c set -ex;  apt-get update;  apt-ge…: 561MB
/bin/sh -c apt-get update && apt-get install…: 141MB
/bin/sh -c set -ex;  if ! command -v gpg > /…: 7.82MB
/bin/sh -c set -eux;  apt-get update;  apt-g…: 24.1MB
/bin/sh -c #(nop)  CMD ["bash"]: 0B
/bin/sh -c #(nop) ADD file:d9e4f6f4fc33703b7…: 101MB
```

### 使用更小的基础镜像

通过 [node 在 Docker 市场的界面](https://hub.docker.com/_/node/)可看到，其中包含很多可使用的选择，

- jessie-*
- buster-*
- stretch-*
- alpine-*

其中 jessie-*, buster-* and stretch-* 基于 Debian 系统，alpine-* 则是 Alpine Linux。一般使用 alpine 即可。

```diff
- FROM node:14
+ FROM node:14-alpine
```

再次查看大小，减少了一半多来到 600+M

```sh
$ docker images
REPOSITORY            TAG       IMAGE ID       CREATED          SIZE
wayou/my-app   latest    f8b6ba45c68f   21 seconds ago   603MB
<none>                <none>    fe1ff8163c15   23 hours ago     1.44GB
<none>                <none>    6e0fb94473a1   3 days ago       1.44GB
```

### 多次编译

详情及原理参见 [Use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)。简单来说，构建镜像文件包含很多步骤，中间步骤依赖使用的东西其实在最后成品中并不需要。

因此，我们可以将整个构建过程分成多步，得到一些中间结果。而这些中间结果是下一步所需要的，但生成这些中间结果的依赖却是下一步不需要的，就可以舍弃。

优化后的 Dockerfile:

```
######## step 1 ########
FROM node:14-alpine AS BUILD_IMAGE

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# this is for npm
# COPY package*.json ./
# but we use yarn
COPY ["package.json", "yarn.lock", "./"]

# npm comes with node
# RUN npm install
# if we use yarn, we need firstly install it
# RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# equivalent for `npm ci`, see https://stackoverflow.com/a/58525708/1553656
# If you are building your code for production
# RUN npm ci --only=production
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

RUN yarn build

######## step 2 ########

FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD [ "node", "dist/main" ]
```

再次生成镜像后查看大小，又减小了一半，来到 300+M，

```
$  docker images
REPOSITORY            TAG       IMAGE ID       CREATED          SIZE
wayou/my-app   latest    c0ffda4c908a   19 seconds ago   351MB
<none>                <none>    f8b6ba45c68f   18 minutes ago   603MB
<none>                <none>    fe1ff8163c15   23 hours ago     1.44GB
```


### 优化 node 依赖

去掉 `devDependency`，更新安装的命令：

```diff
- RUN yarn install --frozen-lockfile
+ RUN yarn install --frozen-lockfile --production=true
```

但是，如果编译过程需要编译 TypeScript，跑测试，跑 Lint 等，此方法就不适用，因为这些依赖均在 `devDependency`。

凡事无绝对，虽然安装时不能去掉，但可以在用完之后去掉。

所以在 `yarn build` 之后使用 `npm prune` 来手动删除这些无用的依赖：

```diff

RUN yarn build

+ # remove development dependencies
+ RUN npm prune --production
```
再次查看大小，减小了一半多：

```
$ docker images
REPOSITORY            TAG       IMAGE ID       CREATED          SIZE
wayou/my-app   latest    9aba2a428703   5 seconds ago    129MB
<none>                <none>    c0ffda4c908a   11 minutes ago   351MB
<none>                <none>    f8b6ba45c68f   29 minutes ago   603MB
<none>                <none>    fe1ff8163c15   23 hours ago     1.44GB
<none>                <none>    6e0fb94473a1   3 days ago       1.44GB
```

### node-prune

使用 [node-prune](https://github.com/tj/node-prune) 进一步删除依赖中的无用文件，比如 markdown，测试文件，TypeScript 的类型文件等。

更新后的 Dockerfile:

```
FROM node:14-alpine AS BUILD_IMAGE

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

# Create app directory
WORKDIR /usr/src/app
…

RUN yarn build

# remove development dependencies
RUN npm prune --production

# run node prune
RUN /usr/local/bin/node-prune

FROM node:14-alpine

WORKDIR /usr/src/app

…
```

注意，运行上面的 Dockerfile 后会报如下错误：

```sh
 => ERROR [build_image 2/9] RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash              0.4s
------
 > [build_image 2/9] RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash:
#6 0.366 /bin/sh: curl: not found
#6 0.366 /bin/sh: bash: not found
```

那是因为切换到 `node:12-alpine` 镜像后其中不再包含 curl 命令，需要单独安装下：

```
FROM node:14-alpine AS BUILD_IMAGE

# alpine doesn't come with curl
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

# Create app directory
WORKDIR /usr/src/app

…
```

这次优化后的大小减少了几 M:

```sh
$ docker images
REPOSITORY            TAG       IMAGE ID       CREATED             SIZE
wayou/my-app   latest    113ca4503190   3 minutes ago       126MB
<none>                <none>    9aba2a428703   46 minutes ago      129MB
<none>                <none>    c0ffda4c908a   57 minutes ago      351MB
<none>                <none>    f8b6ba45c68f   About an hour ago   603MB
<none>                <none>    fe1ff8163c15   24 hours ago        1.44GB
```

## 手动删除

根据 [Honey, I shrunk the node_modules! ...and improved app’s performance in the process](https://tsh.io/blog/reduce-node-modules-for-better-performance/) 里的介绍再手动删除一些依赖文件：


```
…
# run node prune
RUN /usr/local/bin/node-prune


# remove unused dependencies
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/


FROM node:14-alpine
…

```

查看大小，减小了 3M，聊胜于无：

```sh
$ docker images
REPOSITORY            TAG       IMAGE ID       CREATED             SIZE
wayou/my-app   latest    2c54b4ee27cd   4 seconds ago       123MB
<none>                <none>    113ca4503190   9 minutes ago       126MB
<none>                <none>    9aba2a428703   52 minutes ago      129MB
<none>                <none>    c0ffda4c908a   About an hour ago   351MB
<none>                <none>    f8b6ba45c68f   About an hour ago   603MB
<none>                <none>    fe1ff8163c15   24 hours ago        1.44GB
<none>                <none>    6e0fb94473a1   3 days ago          1.44GB
```

## 相关资源

- [Use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)
- [How We Reduce Node Docker Image Size In 3 Steps](https://medium.com/trendyol-tech/how-we-reduce-node-docker-image-size-in-3-steps-ff2762b51d5a)

