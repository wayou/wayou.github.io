---
layout: post
title: "MySQL GROUP BY 的问题"
date: 2019-05-17 23:05:00 +0800
tags: 
---
    
# MySQL GROUP BY 的问题

拿 `employee` 示例数据库为例，当进行如下操作时会报错。

```sh
mysql> SELECT * FROM   employees GROUP  BY gender; 
ERROR 1055 (42000): Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'employees.employees.emp_no' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
```

其中 `employee` 的表结构为：

```sh
mysql> DESCRIBE employees;
+------------+---------------+------+-----+---------+-------+
| Field      | Type          | Null | Key | Default | Extra |
+------------+---------------+------+-----+---------+-------+
| emp_no     | int(11)       | NO   | PRI | NULL    |       |
| birth_date | date          | NO   |     | NULL    |       |
| first_name | varchar(14)   | NO   |     | NULL    |       |
| last_name  | varchar(16)   | NO   |     | NULL    |       |
| gender     | enum('M','F') | NO   |     | NULL    |       |
| hire_date  | date          | NO   |     | NULL    |       |
+------------+---------------+------+-----+---------+-------+
6 rows in set (0.01 sec)
```

## 原因

SQL 标准中不允许 SELECT 列表，HAVING 条件语句，或 ORDER BY 语句中出现 GROUP BY 中未列出的可聚合列。而 MySQL 中有一个状态 [ONLY_FULL_GROUP_BY](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_only_full_group_by) 来标识是否遵从这一标准，默认为开启状态。

所以这样的语句是不可以的，

```sql
# 🚨
SELECT gender, 
       last_name 
FROM   employees 
GROUP  BY gender 
```

将 `last_name` 从 SELECT 中移除或将其添加到 GROUP BY 中都可以修复。

```sh
# ✅
SELECT gender,
FROM   employees 
GROUP  BY gender 

# ✅
SELECT gender, 
       last_name 
FROM   employees 
GROUP  BY gender, 
          last_name  
```

但这样的修改查询出来就可能就不是想要的结果了。

## 解决

三种方式来解决。

### 关闭 ONLY_FULL_GROUP_BY

可以选择关掉 MySQL 的 [ONLY_FULL_GROUP_BY](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_only_full_group_by) 模式。

有两种方式，通过昨晚设置 `sql_mode` 来关闭。

首先查看变更前的 `sql_mode`：

```sh
mysql> SELECT @@sql_mode;
+-----------------------------------------------------------------------------------------------------------------------+
| @@sql_mode                                                                                                            |
+-----------------------------------------------------------------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION |
+-----------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

通过以下脚本关闭 ：

```sql
SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY,',''));
```

再次查询 `@@sql_mode` 返回中应该已经没有该模式了。

```sh
mysql> SELECT @@sql_mode;
+----------------------------------------------------------------------------------------------------+
| @@sql_mode                                                                                         |
+----------------------------------------------------------------------------------------------------+
| STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION |
+----------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

第二种是找到 MySQL 配置文件修改并保存。

MySQL 的配置文件名为 `my.cnf`，可通过以下命令查看你位置：

```sh
$ mysql --help | grep cnf
                      order of preference, my.cnf, $MYSQL_TCP_PORT,
/etc/my.cnf /etc/mysql/my.cnf /usr/local/etc/my.cnf ~/.my.cnf
```

找到后编辑并保存，重启 MySQL 后生效。

```diff
[mysqld]
-sql_mode=ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
+sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

如果文件中没有 `sql_mode` 配置项可手动添加上。

因为 `ONLY_FULL_GROUP_BY` 更加符合 SQL 标准，所以不建议关掉。

### ANY_VALUE()

还可以通过 [ANY_VALUE()](https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html#function_any-value) 来改造查询语句以避免报错。

使用 `ANY_VALUE()` 包裹的值不会被检查，跳过该错误。所以这样是可以的：

```diff
SELECT gender, 
-       last_name
+       ANY_VALUE(last_name) 
FROM   employees 
GROUP  BY gender 
```

### 添加列间的依赖

像这个示例中，

```sql
# 🚨
SELECT gender, 
       last_name 
FROM   employees 
GROUP  BY gender 
```

假如我们让 `gender` 变成不重复的主键，`last_name` 便与 `gender` 产生了一种关系，即 `gender` 可唯一确定 `last_name`。此时便可进行 `GROUP BY` 了。因为，之所以报错是因为在进行聚合的时候有不能确定的列参与了进来。

## 总结

一般 GROUP BY 会与另外的聚合函数配合使用，比如 COUNT(), SUM() 等。查询所有列无差别地进行 GROUP BY 的情况并不是正常的使用姿势。

## 相关资源

- [12.20.3 MySQL Handling of GROUP BY](https://dev.mysql.com/doc/refman/5.7/en/group-by-handling.html)
- [ONLY_FULL_GROUP_BY](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_only_full_group_by)
- [12.21 Miscellaneous Functions](https://dev.mysql.com/doc/refman/5.7/en/miscellaneous-functions.html)
- [12.20.1 Aggregate (GROUP BY) Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html)

    