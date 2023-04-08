---
layout: post
title: "OpenWrt 扩展 Overlay 空间"
date: 2023-04-08T02:20:34Z
---
# OpenWrt 扩展 Overlay 空间

OpenWrt 安装软件包时，会遇到 

## 查看磁盘使用情况

首先查看当前磁盘使用情况，确定容量：

```sh
$ lsblk
NAME          MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0           7:0    0 157.7M  0 loop /overlay
nvme0n1       259:0    0 119.2G  0 disk 
├─nvme0n1p1   259:1    0    16M  0 part /boot
│                                       /boot
├─nvme0n1p2   259:2    0   500M  0 part /rom
└─nvme0n1p128 259:3    0   239K  0 part
```

可以看到，当前磁盘大小为 119.2G，已使用 16M + 500M，还剩 100+G 的空间是没有被挂载的

## 扩展 overlay 空间

使用 `cfdisk` 打开分区工具：

```sh
$ cfdisk
cfdisk: cannot open /dev/sda: No such file or directory
```

可以看到因为咱们的磁盘名并不是默认的 `sda`，所以报错。可通过如下命令查看挂载的磁盘名称：

```sh
$ fdisk -l
Disk /dev/loop0: 157.69 MiB, 165347328 bytes, 322944 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
GPT PMBR size mismatch (1057311 != 250069679) will be corrected by write.
The backup GPT table is not on the end of the device.


Disk /dev/nvme0n1: 119.24 GiB, 128035676160 bytes, 250069680 sectors
Disk model: SSD 128GB                               
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 49AD2B3D-534B-5870-F97F-D195C1104D00

Device           Start     End Sectors  Size Type
/dev/nvme0n1p1     512   33279   32768   16M Linux filesystem
/dev/nvme0n1p2   33280 1057279 1024000  500M Linux filesystem
/dev/nvme0n1p128    34     511     478  239K BIOS boot

Partition table entries are not in disk order.
```

通过这里的命令，或者其实最开始的 `lsblk` 命令，可以看到，磁盘名称为 `nvme0n1`，所以在调用 `fdisk` 时指定一下磁盘名称：

```sh
$ cfdisk /dev/nvme0n1
```

此时打开了分区工具，可以看到如下界面：

```
                                                      Disk: /dev/nvme0n1
                                    Size: 119.24 GiB, 128035676160 bytes, 250069680 sectors
                                 Label: gpt, identifier: 49AD2B3D-534B-5870-F97F-D195C1104D00

    Device                                Start                End            Sectors            Size Type
    /dev/nvme0n1p1                          512              33279              32768             16M Linux filesystem
    /dev/nvme0n1p2                        33280            1057279            1024000            500M Linux filesystem
    /dev/nvme0n1p128                         34                511                478            239K BIOS boot
>>  Free space                          1058816          250069646          249010831          118.7G    
```

通过 <kdb>j</kdb> <kdb>k</kdb> 上下移动，选择最后一行 `Free space`，回车，此时需要输入分区大小，默认是所有剩余空间，回车即可。

然后将光标向右移动选择最下方菜单中的 `Write` 回车，此时会提示：

```
 Are you sure you want to write the partition table to disk? 
```

输入 `yes` 回车确认。

最后光标移动到 `Quit` 退出分区工具。

完成后的样子：
<img width="822" alt="Screenshot 2023-04-07 at 21 05 05" src="https://user-images.githubusercontent.com/3783096/230615265-75ee0b74-e4fa-4f59-85ed-de5694b93753.png">

## 格式化分区

此时再通过 `lsblk` 查看时，多出了刚刚创建的分区：

```
NAME          MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0           7:0    0 157.7M  0 loop /overlay
nvme0n1       259:0    0 119.2G  0 disk 
├─nvme0n1p1   259:1    0    16M  0 part /boot
│                                       /boot
├─nvme0n1p2   259:2    0   500M  0 part /rom
├─nvme0n1p128 259:3    0   239K  0 part 
└─nvme0n1p3   259:4    0 118.7G  0 part 
```

通过如下命令格式化分区：

```sh
$ mkfs.ext4 /dev/nvme0n1p3
mke2fs 1.46.5 (30-Dec-2021)
Discarding device blocks: done                            
Creating filesystem with 31126353 4k blocks and 7782400 inodes
Filesystem UUID: 39293d86-3049-4808-98d6-f61e97838389
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
	4096000, 7962624, 11239424, 20480000, 23887872

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (131072 blocks): done
Writing superblocks and filesystem accounting information: done 
```

## 挂载分区

```sh
$ mkdir /mnt/overlay
$ mount /dev/nvme0n1p3 /mnt/overlay
```

## 复制文件

将原来 overlay 中的文件全部备份到新的分区中：

```sh
$ cp -r /overlay/* /mnt/overlay/
```

检查是否复制成功：

```sh
$ ls /mnt/overlay/
lost+found  upper       work
```

可以看到文件成功备份。

## 修改配置

回到 OpenWrt 的配置界面，左侧菜单中选择「挂载点」进入配置，向下滚动到底部找到「挂载点」配置项，点击「添加」：

![3](https://user-images.githubusercontent.com/3783096/230615173-f5d6dc71-b609-4c0d-8a3e-89f16274ea3d.png)

在添加界面中，勾选「启用此挂载点」，UUID 选择刚刚创建的分区，「挂载点」选择「作为外部 Overlay 使用」，最后点击「保存 & 应用」。

![4](https://user-images.githubusercontent.com/3783096/230615153-233374b4-b6ab-4193-b569-6ff2787f0c6a.png)


## 重启

最后点击 OpenWrt 左侧菜单的「重启」，重启系统。完成后再到「软件包」界面查看，空间已经扩大，可以任意使用了。

![5](https://user-images.githubusercontent.com/3783096/230615125-0f196601-903a-4833-87f2-e43b36d514bc.png)



## 相关资源

- [openwrt无法保存配置?! ESXI下虚拟机openwrt扩容overlay软件包](https://www.bilibili.com/video/BV1TM4y1u7ka/?spm_id_from=333.999.0.0&vd_source=253eeafb084d81b6a6584e6a3350628a)
- [安装了cfdisk为什么还是not found呀？](https://www.right.com.cn/forum/thread-8257582-1-1.html)

