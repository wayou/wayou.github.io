---
layout: post
title: "MySQL Over 函数"
date: 2021-08-14T03:34:52Z
---
# MySQL Over 函数

MySQL 8.0.2 中引入了 Window 函数，用于对返回的行及其关联的行进行一些计算操作，这些被计算的行则是通过 `OVER` 函数定义的。

连带会涉及 `PARTITION BY` 语句，该语句使用在 `OVER()` 函数中，合作作用之后形成的数据行也叫作 Window，然后可用于所有 Window 函数譬如 `RANK`，`LEAD`，`LAG` 等，也可用于大部分聚合函数譬如 `AVG` ，`SUM`...

这么说有些抽象，举个例子，考察如下数据表：



h_id | h_name | challenge_id | score
-- | -- | -- | --
3 | shubh | 111 | 20
2 | aayush | 111 | 80
5 | krithik | 112 | 40
5 | krithik | 114 | 90
4 | tushar | 112 | 30
1 | parth | 112 | 40


记录了不同人参加不同比赛的得分，现在想统计出每个人在单个比赛中的排名，可以这样写：

```sql
SELECT challenge_id,
       h_id,
       h_name,
       score,
       dense_rank() OVER (PARTITION BY challenge_id
                          ORDER BY score DESC) AS "rank",
FROM hacker;
```

上述语句中，

- `PARATITION BY` 将结果集按 `challenge_id` 即不同的比赛进行分组，
- `ORDER BY` 将每个分组中的人按得分降序排列
- 上述两个语句结合 `OVER()` 形成一个 Window，作为 Window 函数 `dense_rank()` 的入参
- `dense_rank()` 为排序后的分组创建 `order` 列

执行结果：


challenge_id | h_id | h_name | score | rank
-- | -- | -- | -- | --
111 | 2 | aayush | 80 | 1
111 | 3 | shubh | 20 | 2
112 | 5 | krithik | 40 | 1
112 | 1 | parth | 40 | 1
112 | 4 | tushar | 30 | 2
114 | 5 | krithik | 90 | 1


以上。

## 相关资源

- [What Is the MySQL OVER Clause?](https://learnsql.com/blog/over-clause-mysql/)
- [MySQL Doc  - 12.21 Window Functions](https://dev.mysql.com/doc/refman/8.0/en/window-functions.html)
- [MySQL Sample Database](https://dev.mysql.com/doc/employee/en/)
- [MySQL Doc - Window functions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html)
- [MySQL | PARTITION BY Clause](https://www.geeksforgeeks.org/mysql-partition-by-clause/#:~:text=over()%20clause%20defines%20how,will%20be%20assigned%20same%20rank.)
