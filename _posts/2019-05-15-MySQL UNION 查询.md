---
layout: post
title: "MySQL UNION 查询"
date: 2019-05-15 23:05:00 +0800
tags: 
---
    
# MySQL UNION 查询

`UNION` 用来合并多个 SELECT 结果。

考察如下两个表：

```sh
# t1
+----+---------+
| id | pattern |
+----+---------+
|  1 | Divot   |
|  2 | Brick   |
|  3 | Grid    |
+----+---------+

# t2
+----+---------+
| id | pattern |
+----+---------+
| 1  | Divot   |
| A  | Brick   |
| B  | Grid    |
| C  | Diamond |
+----+---------+
```

一个 union 示例：

```sql
mysql> select * from t1 union select * from t2;
+----+---------+
| id | pattern |
+----+---------+
| 1  | Divot   |
| 2  | Brick   |
| 3  | Grid    |
| A  | Brick   |
| B  | Grid    |
| C  | Diamond |
+----+---------+
6 rows in set (0.00 sec)
```

默认情况下 UNION 结果中已经去重，所以无须指定 DISTINCT。如果想保留所有结果可指定 `ALL`。

```sh
mysql> SELECT * FROM t1 UNION ALL SELECT * FROM t2;
+----+---------+
| id | pattern |
+----+---------+
| 1  | Divot   |
| 2  | Brick   |
| 3  | Grid    |
| 1  | Divot   |
| A  | Brick   |
| B  | Grid    |
| C  | Diamond |
+----+---------+
7 rows in set (0.00 sec)
```

查询语句中可混合使用 [`UNION ALL`](https://dev.mysql.com/doc/refman/8.0/en/union.html) 和 [`UNION DISTINCT`](https://dev.mysql.com/doc/refman/8.0/en/union.html)，右边的 `UNION DISTINCT` 替覆盖掉左边 `UNION ALL`。

结果中的列名将使用第一个 SELECT 语句中定义的列名。各 SELECT 结果中对应位置的列其数据类型应该保持一致。如果不一致，MySQL 会根据结果中的数据类型及长度进行兼容的转换。

UNION 语句中只最后一个 SELECT 可指定 INTO OUTFILE。但其实整个 UNION 查询的结果都是存入这个文件的。
UNION 中不能搭配使用 HIGH_PRIORITY。如果该关键词指定在第一个 SELECT 身上，不会生效，指定在其他 SELECT 上会报语法错误。

结合使用 `ORDER BY` 或 `LIMIT` 时，应使用括号将 SELECT 语句包裹。

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
```

对 UNION 结果进行整体排序和数量限制：

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2)
ORDER BY a LIMIT 10;
```

SELECT 中指定了别名时，ORDER BY 应该使用该别名，而不是真实的列名。

```sql
--  ✅
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY b;
-- 🚨 Unknown column 'a' in 'order clause'
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY a;
```

## 相关资源

- [MySQL Manual - 13.2.10.3 UNION Syntax ](https://dev.mysql.com/doc/refman/8.0/en/union.html)

    