---
layout: post
title: "MySQL EXPLAIN 语句"
date: 2019-05-27 00:05:00 +0800
tags: 
---
    
# MySQL EXPLAIN 语句

对于 MySQL 在执行时来说，[EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) 功能上与 [DESCRIBE](https://dev.mysql.com/doc/refman/8.0/en/describe.html) 一样。实际运用中，后者多用来获取表的信息，而前者多用于展示 MySQL 会如何执行 SQL 语句（[Obtaining Execution Plan Information](https://dev.mysql.com/doc/refman/8.0/en/explain.html#explain-execution-plan)）。

[DESCRIBE](https://dev.mysql.com/doc/refman/8.0/en/describe.html) 实质上是 [SHOW COLUMNS](https://dev.mysql.com/doc/refman/8.0/en/show-columns.html) 语句的缩略形式。

- [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) 可作用于这些 SQL 关键词：SELECT, DELETE, INSERT, REPLACE 以及 UPDATE。
- 当作用于可解释性的语句（explainable statement）时，其展示相应 SQL 语句被优化后的执行计划（execution plan），也就是 MySQL 会如何处理该 SQL 查询语句，比如有 `JOIN` 语句时多表是怎样结合，以怎样的顺序结合。
- 当作用于 `FOR CONNECTION connection_id` 而不是可解释性语句时，其展示的是该连接的执行计划。
- 涉及到对分区表的查询时，[EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) 就十分有用了。

通过 [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) 你能看出在哪里添加索引以优化加速查询语句，也可以查看联表时是否以最佳顺序进行的。


[EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html) 的输出中，为每张参与查询的表生成一行结果，顺序则是按 MySQL 读取这些且的顺序。MySQL 进行 JOIN 操作时，实际是是通过嵌套循环完成的，即先读取第一张表的一条记录，再去第二张表中寻找匹配的记录，再去第三张表中匹配，以此类推。


### Wrokbench 中查看执行计划

MySQL 的 GUI 工具 Workbench 提供了可视化的途径查看执行计划，这对于性能分析很有用。

![MySQL Workbench 中执行计划的可视化展示](https://user-images.githubusercontent.com/3783096/58379691-a38bf500-7fd9-11e9-9151-216cae041812.png)
<p align="center">MySQL Workbench 中执行计划的可视化展示</p>

## EXPLAIN 输出表格中的含义


|列名|	JSON 中的列名|	含义|
|---|---|---|
|id|	select_id|	SELECT 标识|
|select_type|	N/A|	SELECT 类型|
|table|	table_name|	构造该行输出的表名|
|partitions|	partitions|	匹配到的分区表|
|type|	access_type|	JOIN 类型|
|possible_keys|	possible_keys|	可选的索引|
|key|	key|	真实选中的索引|
|key_len|	key_length|	被选中的键的长度|
|ref|	ref|	用于和索引进行对比的列|
|rows|	rows|	预估用于查询的记录数|
|filtered|	filtered|	被查询条件过滤掉的记录数百分比|
|Extra|	N/A|	额外的其他信息|

_来自 MySQL Reference Manual 中关于 EXPLAIN 输出的表格_

其中 JSON 列表是将该输出导出为 JSON 格式时使用的列名。

其中 `select_type` SELECT 类型，所有可能的值见下表：

|select_type Value|	JSON Name|	Meaning|
|---|---|---|
|SIMPLE|	None|	普通类型的 SELECT，没有 UNION 及子查询|
|PRIMARY|	None|	最外层的 SELECT|
|UNION|	None|	配合 UNION 使用时第二个及后面的 SELECT |
|DEPENDENT UNION|	dependent (true)|	配合 UNION 使用时第二个及后面的 SELECT，因外层的查询而有差异 |
|UNION RESULT|	union_result| UNION 返回的结果|
|SUBQUERY|	None|	子查询中第一个 SELECT |
|DEPENDENT SUBQUERY|	dependent (true)|	子查询中第一个 SELECT，因外层查询而异|
|DERIVED|	None|	衍生表|
|DEPENDENT DERIVED|	dependent (true)|	依赖于其他表的衍生表|
|MATERIALIZED|	materialized_from_subquery|	物化的子查询|
|UNCACHEABLE SUBQUERY|	cacheable (false)|	无法缓存的子查询，对于第一行必需重新执行|
|UNCACHEABLE UNION|	cacheable (false)|	不可缓存的子查询里 UNION 中第二个及往后的 SELECT|

`type` JOIN 类型描述表是如何被联接的，其可能的值有以下这些，排序由最优到最次：

- [system](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_system)：表中只有一条记录，属于 [const](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_const) JOIN 类型的一个特例。
- [const](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_const)：表中至多只有一条匹配的记录。因为只有一条，所以取出的列值可当作常量被优化，查询速度最快。当主键（ PRIMARY KEY）或唯一性索引（UNIQUE index）与常量进行比较时，会使用此类型。

```sql
SELECT * FROM tbl_name WHERE primary_key=1;

SELECT * FROM tbl_name
  WHERE primary_key_part1=1 AND primary_key_part2=2;
```

- [eq_ref](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_eq_ref)：对于前面每个表中记录的组合，都从这个表里读取一条记录。该类型可用于对索引列使用 `=` 操作符进行比较时。

```sql
SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column=other_table.column;

SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column_part1=other_table.column
  AND ref_table.key_column_part2=1;
```

- [ref](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_ref)：对于前面每个表中记录的组合，从该表读取所有所有匹配到的索引记录。ref 用于 JOIN 使用使用非主键或唯一索引列时，或只使用键的前缀的场景。

```sql
SELECT * FROM ref_table WHERE key_column=expr;

SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column=other_table.column;

SELECT * FROM ref_table,other_table
  WHERE ref_table.key_column_part1=other_table.column
  AND ref_table.key_column_part2=1;
```

- [fulltext](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_fulltext)：JOIN 使用的是 FULLTEXT 类型的索引
- [ref_or_null](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_ref_or_null)：类似 ref，但会对 NULL 值做额外的查询。这种类型的 JOIN 优化常用于子查询，以下的示例 MySQL 全会使用 ref_or_null 联表来处理 ref_table ：

```sql
SELECT * FROM ref_table
  WHERE key_column=expr OR key_column IS NULL;
```

- [index_merge](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_index_merge)：表示将会运用索引合并这一优化方式，详见 [Section 8.2.1.3, “Index Merge Optimization”](https://dev.mysql.com/doc/refman/8.0/en/index-merge-optimization.html)。

 - [unique_subquery](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_unique_subquery)：替换某些场景下 IN 语句中子查询的 eq_ref 类型的联表。

- [index_subquery](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_index_subquery)：类似 unique_subquery，替换 IN 子查询，但作用于非唯一性索引（nonunique indexes）。

```sql
value IN (SELECT key_column FROM single_table WHERE some_expr)
```

- [range](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_range)：只返回范围内的记录。
- [index](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_index)：同 ALL 类型，但只使用索引来搜索。
- [ALL](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html#jointype_all)：查询时进行全表扫描。


## 相关资源

- [13.8.2 EXPLAIN Syntax](https://dev.mysql.com/doc/refman/8.0/en/explain.html)
- [Explain Vs Desc anomalies in mysql](https://stackoverflow.com/questions/3100247/explain-vs-desc-anomalies-in-mysql)
- [8.8.2 EXPLAIN Output Format](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html)




    