---
layout: post
title: "[Golang] 接收 interface 返回 struct"
date: 2021-09-11T08:18:54Z
---
# [Golang] 接收 interface 返回 struct

Golang 编程中有个最佳实践是将依赖定义为 interface 而返回定义为 struct。

## interface in

这里包含两层意思，

- 依赖定义成 interface
- 这个 interface 应该在调用方定义

因为 interface 是 [duck typing](https://en.wikipedia.org/wiki/Duck_typing) 的，只要满足 interface 定义的约束就可作为入参，这有助于将调用方与被调用方解耦。

具体来说，比如有个用于创建查询用户信息的服务：

```go
//user.go
package user
type UserStore interface {
   Insert(item interface{}) error
   Get(id int) error
}
type UserService struct {
   store UserStore
}
// Accepting interface here!
func NewUserService(s UserStore) *UserService {
   return &UserService{
      store: s,
   }
}
func (u *UserService) CreateUser() { ... }
func (u *UserService) RetrieveUser(id int) User { ... }
```

它不用关心底层具体使用哪种数据库，以及使用什么方法进行插入，它只约定依赖于一个 `UserStore` 接口。

同时创建一个实现了该接口方法的模块：

```go
// store/mysql.go

package store

import "database/sql"//db.go
package db
type Store struct {
   db *sql.DB
}
func NewDB() *Store { ... } //func to initialise DB
func (s *Store) Insert(item interface{}) error { ... } //insert item
func (s *Store) Get(id int) error { ... } //get item by id

type MySQLStore struct {
	db *sql.DB
}

func (s *MySQLStore) Insert(item interface{}) error {
	return nil
}
```

因为 user service 依赖的是 interface，当后面我们切换数据库到其他数据库时，只需要新建一个 store 提供对应方法即可，而不用更新我们的 user service 去接收一个叫作 `PGStore` 的依赖。

同理，编写单元测试也会方便许多，我们只需要 mock 一个实现了该接口的对象即可，因为 interface 的依赖已经通过抽象剥离了出来，使得测试变得方便和纯粹。

注意到调用方所依赖的 interface 是在 `UserService` 中定义的，一是因为调用方比较清楚它的依赖，二是同样达到解耦的目的，如果定义在被调方，则会形成入侵。

## struct out

而我们函数的返回应该是 struct 类型。这样在调用后得到提具体的类型，上面的字段是清晰的，不用再次作类型转换。

但有个例外是函数返回的错误对象，是使用 `error` 这个 interface 来接收的。因为不同地方返回的错误实现可能不同，大部分情况下会是自定义的错误对象，只有使用 interface 来进行接收。

## 相关资源

- [“Accept interfaces, return structs” in Go](https://bryanftan.medium.com/accept-interfaces-return-structs-in-go-d4cab29a301b?source=bookmarks---------4----------------------------)
