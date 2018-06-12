import React, { Component } from "react";
import isAuthenticated from "./auth";
import Login from "./Login";

const loadDataAndCheckAuth = WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: []
      };
    }
    componentDidMount() {
      fetch(this.props.api)
        .then(res => res.json())
        .then(data => this.setState({ data: data.items }));
    }
    render() {
      return isAuthenticated ? (
        <WrappedComponent {...this.props} data={this.state.data} />
      ) : (
        <Login />
      );
    }
  };
};
export default loadDataAndCheckAuth;
