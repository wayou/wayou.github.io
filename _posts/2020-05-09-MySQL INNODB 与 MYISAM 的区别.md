---
layout: post
title: "MySQL INNODB 与 MYISAM 的区别"
date: 2020-05-09 21:05:00 +0800
tags: 
---
    
# MySQL INNODB 与 MYISAM 的区别


- InnoDB 支持表级别的事务（transactions）而 MyISAM 不然
- InnoDB 支持行级别的锁和外键关联，而 MyISAM 只支持表级别的锁
- MySQL 5.6 之前InnoDB 不支持全文索引(FLUUTEXT) 而 MyISAM 可以
- MyISAM 表在性能和速度优于 InnoDB 表
- InnoDB 因为支持事务，Volume 所在更适合数据量大的情况，而 MyISAM 适合于小型数据库场景
- 由于 InnoDB 支持行级别的锁，在执行插入与更新时速度优于 MyISAM
- InnoDB 支持 ACID (Atomicity, Consistency, Isolation and Durability) 而 MyISAM 不然
- InnoDB 中 AUTO_INCREMENT 是索引的一部分
- InnoDB 中表一旦被删除无法重建
- InnoDB 不是以表为单位进行存储的，所以在执行 `SELECT COUNT(*)` 获取总数时需要扫描整个表，而 MyISAM 以表为单位进行存储获取总数可以很便捷
- InnoDB 支持外键而 MyISAM 不然

## 相关资源

- [the main differences between INNODB and MYISAM](http://www.expertphp.in/article/what-are-the-main-differences-between-innodb-and-myisam)
- [Chapter 14 The InnoDB Storage Engine](https://dev.mysql.com/doc/refman/5.6/en/innodb-storage-engine.html#idp78887728)

    