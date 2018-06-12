import React, { Component } from "react";

class UserList extends Component {
  render() {
    return (
      <div className="user-list">
        <h1>user list</h1>
        {this.props.data.map(user => <p>{user.name}</p>)}
      </div>
    );
  }
}

export default UserList;
