---
layout: post
title: "MySQL SQL_MODE 的设置"
date: 2019-06-09 12:06:00 +0800
tags: 
---
    
# SQL_MODE 的设置


## 查看当前的 SQL_MODE

```sql
SELECT @@sql_mode
```

<details>
<summary>
SELECT @@sql_mode 的执行结果
</summary>

```sh
mysql> SELECT @@sql_mode;
+-----------------------------------------------------------------------------------------------------------------------+
| @@sql_mode                                                                                                            |
+-----------------------------------------------------------------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION |
+-----------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

</details>

## 设置 SQL_MODE

设置 SQL_MODE 是通过 `SET` 关键词进行的，其他参数值也可通过该关键词进行修改。可通过 `SHOW VARIABLES` 查看到所有可用配置项。

设置系统变量时，可指定所设置的作用域，也可通过 `@@` 前缀来获取变量，甚至也可以没有任何前缀，以下写法都是合法的：

```sql
SET SESSION sql_mode = 'TRADITIONAL';
SET LOCAL sql_mode = 'TRADITIONAL';
SET @@SESSION.sql_mode = 'TRADITIONAL';
SET @@LOCAL.sql_mode = 'TRADITIONAL';
SET @@sql_mode = 'TRADITIONAL';
SET sql_mode = 'TRADITIONAL';
```

可用的 SQL 模式可在官方文档中查询到 [5.1.10 Server SQL Modes](https://dev.mysql.com/doc/refman/5.6/en/sql-mode.html)。

### 系统变量的作用域

> There are two scopes in which system variables exist. Global variables affect the overall operation of the server. Session variables affect its operation for individual client connections. A given system variable can have both a global and a session value. 
>
> _--[5.1.9 Using System Variables](https://dev.mysql.com/doc/refman/8.0/en/using-system-variables.html)_

系统的这些配置项有其作用项，是分开进行管理的。

其中，

- `GLOBAL` 类型会对每次连接生效。
- `SESSION` 类型只对当前连接生效，`LOCAL` 关键词等效。

两者皆为运行时变量，可随时修改。

- `PERSIST` 类型不影响运行时，会将设置结果写入 `mysqld-auto.cnf` 这个 MySQL 配置文件。


所以，设置时可通过在 `SET` 后加相应作用域的修饰词，像这样

```sql
SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION';
```

也可以通过 `@@` 加上作用域进行变量访问的方式：

```sql
SET @@GLOBAL.sql_mode = 'NO_ENGINE_SUBSTITUTION';
```

两者是等效的。


作用域缺省情况下为 `SESSION` 类型，即只对当前连接生效。

```sql
SET @@sql_mode = 'NO_ENGINE_SUBSTITUTION';
```

### MySQL 中的配置文件

下面表格来自官方文档 [Table 4.2 Option Files Read on Unix and Unix-Like Systems](https://dev.mysql.com/doc/refman/8.0/en/option-files.html) 部分。

|文件|	用途|
|---|---|
|/etc/my.cnf|	全局配置项|
|/etc/mysql/my.cnf|	全局配置项|
|SYSCONFDIR/my.cnf|	全局配置项|
|$MYSQL_HOME/my.cnf|	服务器相关配置项，有于服务端|
|defaults-extra-file|	如果存在该文件的话，通过[`--defaults-extra-file`](https://dev.mysql.com/doc/refman/8.0/en/option-file-options.html#option_general_defaults-extra-file) 参数启用程序时会读取该配置项|
|~/.my.cnf|	用户配置项|
|~/.mylogin.cnf|	用户登录路径相关，用于客户端|
|DATADIR/mysqld-auto.cnf|	[`SET PERSIST`](https://dev.mysql.com/doc/refman/8.0/en/set-variable.html) 或 [`SE PERSIST_ONLY`](https://dev.mysql.com/doc/refman/8.0/en/set-variable.html) 设置的系统参数会保存到该文件|


## 相交资源

- [5.1.10 Server SQL Modes](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html)
- [setting global sql_mode in mysql](https://stackoverflow.com/questions/2317650/setting-global-sql-mode-in-mysql)
- [5.1.9 Using System Variables](https://dev.mysql.com/doc/refman/8.0/en/using-system-variables.html)
- [4.2.2.2 Using Option Files](https://dev.mysql.com/doc/refman/8.0/en/option-files.html)
- [13.7.4.1 SET Syntax for Variable Assignment](https://dev.mysql.com/doc/refman/5.7/en/set-variable.html)

    