---
layout: post
title: "使用 Docker 部署 Node 应用 - 应用在服务器上的部署"
date: 2021-06-18T13:32:47Z
---
# 使用 Docker 部署 Node 应用 - 应用在服务器上的部署

前面[使用 Docker 部署 Node 应用 - 镜像文件尺寸的优化](https://github.com/wayou/wayou.github.io/issues/282)一文中，通过各种手段将镜像文件的大小已经降到了一个理想的状态，此时再进行分发就会方便很多了。毕竟，传递上 G 大小的文件和 100+M 大小的文件，还是很不一样的。

## 发布与部署

通过将镜像发布到 [Docker Hub](https://hub.docker.com/)， 在服务器再安装下来进行部署。

```sh
# 本机
$ docker tag my-app wayou/myapp
$ docker push wayou/myapp

# 远端服务器
$ docker pull wayou/myapp
```

此种方式需要注意，默认发布后是公开的，如果应用想保密，需要到 Docker Hub 对镜像进行设置。

当时，此种方式也需要你先去 Docker Hub 创建帐号。

如果项目私有，没有分享的需求，完全可以将本地镜像打成 zip 包上传到服务器进行部署：

```sh
# 本机
$ docker save wayou/my-app:latest | gzip > my-app.tar.gz
$ scp my-app.tar.gz <user>@<server-addres>:<target-location>

# 远端服务器
$ docker load -i path/to/image.tar.gz
```

其中 `docker load` 从压缩包加载镜像到 Docker。


## 运行

首先确保服务器上已运行 Docker 进程：

```sh
$ sudo service docker start
```

然后加载镜像：

```sh
$ docker load -i <my_image>.tar.gz
```

查看加载的镜像：

```sh
$ docker images
wayou/my-app   latest    2c54b4ee27cd   28 minutes ago   123MB
```

然后就可以像在本地一样运行之：

```sh
$ docker run -p 8000:3000 -d --name my-app wayou/my-app
```

## 镜像的更新

上面完成了应用的首次部署，后续当然有更新的需求，比如改了 bug，生成新的压缩包上传后，就需要重新运行这个新版本。

当使用新的压缩包加载并运行时会报如下错误：

```
docker: Error response from daemon: Conflict. The container name "/my-app" is already in use by container "c019756f7a5cc744e75ccdef3ecdfa536ae91ce481e96e341e5156d5b50ad1f9". You have to remove (or rename) that container to be able to reuse that name.
See 'docker run --help'.
```

需要先将同名已存在的容器先停止，再删除，

```sh
docker stop my-app
docker rm my-app
```

然后再运行就正常了，因为每次运行新版本都需要先进行删除操作，你可以将这些命令写成一个脚本，比如 run.sh:

```sh
docker stop price-service
docker rm price-service
docker run -p 8000:3000 -d --name my-app wayou/my-app
```

以上。

