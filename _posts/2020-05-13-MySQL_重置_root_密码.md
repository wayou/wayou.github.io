---
layout: post
title: "MySQL 重置 root 密码"
date: 2020-05-13T15:47:21Z
---
# MySQL 重置 root 密码


使用以下语句尝试修改 root 密码时，


```sh
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
```

如果提示如下错误：

```sh
ERROR 1819 (HY000): Your password does not satisfy the current policy requirements
```

那是因为新密码不满足安全性要求，可查看目前的密码要求：

```sh
mysql> show variables like 'validate_password%'
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password.check_user_name    | ON     |
| validate_password.dictionary_file    |        |
| validate_password.length             | 8      |
| validate_password.mixed_case_count   | 1      |
| validate_password.number_count       | 1      |
| validate_password.policy             | MEDIUM |
| validate_password.special_char_count | 1      |
+--------------------------------------+--------+
7 rows in set (0.04 sec)
```

根据上述规则重新设置密码。

也可以修改该规则以满足需要，比如：

```sh
SET GLOBAL validate_password_length = 4;
SET GLOBAL validate_password_number_count = 0;
```

再次检查规则：

```sh
mysql> show variables like 'validate_password%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password.check_user_name    | ON     |
| validate_password.dictionary_file    |        |
| validate_password.length             | 4      |
| validate_password.mixed_case_count   | 1      |
| validate_password.number_count       | 0      |
| validate_password.policy             | MEDIUM |
| validate_password.special_char_count | 1      |
+--------------------------------------+--------+
7 rows in set (0.00 sec)
```

最后，也可以通过关闭密码检查的插件来达到设置任意密码的目的，

```sh
mysql>uninstall plugin validate_password;
```

但不建议这么做，或者说改好密码后再重新将插件装回来。


## 相关资源

- [How to Reset the Root Password](https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html)

