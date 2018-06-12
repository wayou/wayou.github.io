import React, { Component } from "react";
import isAuthenticated from "./auth";
import Login from "./Login";

const withAuth = WrappedComponent => {
  return class extends Component {
    render() {
      if (isAuthenticated) {
        return <WrappedComponent {...this.props} />;
      } else {
        return <Login />;
      }
    }
  };
};
export default withAuth;
