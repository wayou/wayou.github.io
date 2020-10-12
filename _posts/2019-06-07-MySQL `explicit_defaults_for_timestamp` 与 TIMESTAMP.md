---
layout: post
title: "MySQL `explicit_defaults_for_timestamp` 与 TIMESTAMP"
date: 2019-06-07 09:06:00 +0800
tags: 
---
    
# MySQL `explicit_defaults_for_timestamp` 与 TIMESTAMP

考察下面的 SQL 脚本：

```sql
CREATE TABLE test1(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  data VARCHAR(20),
  ts1 TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

语义上来看，这里 `ts1` 列没有指定默认值，同时也没指定 `ON UPDATE` 的操作。

实际情况则不然，在 `explicit_defaults_for_timestamp` 关闭的情况下，`t1` 会被默认加上 `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`。这可通过 `DESCRIBE test1` 查看到。

```sh
mysql> describe test1;
+-----------+-------------+------+-----+-------------------+-----------------------------------------------+
| Field     | Type        | Null | Key | Default           | Extra                                         |
+-----------+-------------+------+-----+-------------------+-----------------------------------------------+
| id        | int(11)     | NO   | PRI | NULL              | auto_increment                                |
| data      | varchar(20) | YES  |     | NULL              |                                               |
| ts1       | timestamp   | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| createdAt | timestamp   | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updatedAt | timestamp   | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
+-----------+-------------+------+-----+-------------------+-----------------------------------------------+
5 rows in set (0.01 sec)
```

## `@@explicit_defaults_for_timestamp`

[`explicit_defaults_for_timestamp`](https://dev.mysql.com/doc/refman/5.6/en/server-system-variables.html#sysvar_explicit_defaults_for_timestamp) 控制是否开启非标准模式下非法的日期值继续努力 NULL，零值等日期默认值被写入 TIMESTAMP 类型。

```sh
mysql> select @@explicit_defaults_for_timestamp;
+-----------------------------------+
| @@explicit_defaults_for_timestamp |
+-----------------------------------+
|                                 1 |
+-----------------------------------+
1 row in set (0.00 sec)
```

可以看到默认为开，现在来关闭它：

```sh
set @@explicit_defaults_for_timestamp=0;
```

<details>
<summary>
关闭 `explicit_defaults_for_timestamp` 的执行结果
</summary>

```sh
mysql> set @@explicit_defaults_for_timestamp=0;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> select @@explicit_defaults_for_timestamp;
+-----------------------------------+
| @@explicit_defaults_for_timestamp |
+-----------------------------------+
|                                 0 |
+-----------------------------------+
1 row in set (0.00 sec)
```
</details>


此时便可以正常执行文章开头的 SQL 语句创建一个未指定默认值的 TIMESTAMP 列。

根据官方文档中相关描述：

> TIMESTAMP and DATETIME columns have no automatic properties unless they are specified explicitly, with this exception: If the explicit_defaults_for_timestamp system variable is disabled, the first TIMESTAMP column has both DEFAULT CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP if neither is specified explicitly.
>
> _--[11.3.4 Automatic Initialization and Updating for TIMESTAMP and DATETIME](https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html)_

当且仅当表中第一个 `TIMESTAMP` 类型的列在没有指定默认值时，MySQL 会会其自动加上 `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`。这里 `ON UPDATE CURRENT_TIMESTAMP` 就需要小心了，如果你想保存的是一个确定性，它会在记录更新时自动更新这个日期，这就是我们表要的表现了。

所以对于 TIMESTAMP 类型，最好指定默认值，避免不可预知的表现。

## 相关资源

- [Gotcha! Timezones in nodejs and mysql](https://medium.com/@magnusjt/gotcha-timezones-in-nodejs-and-mysql-b39e418c9d3)
- [11.3.4 Automatic Initialization and Updating for TIMESTAMP and DATETIME](https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html)

    