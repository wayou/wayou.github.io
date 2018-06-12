import React, { Component } from "react";

const withLog = WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
      console.log(`${this.getName()} constructor`);
    }
    getName() {
      return WrappedComponent.displayName || WrappedComponent.name || "";
    }

    shouldComponentUpdate() {
      console.log(`${this.getName()} shouldComponentUpdate`);
    }
    render() {
      console.log(`${this.getName()} render`);
      return <WrappedComponent {...this.props} />;
    }
    componentDidMount() {
      console.log(`${this.getName()} componentDidMount`);
    }
    componentDidUpdate() {
      console.log(`${this.getName()} componentDidUpdate`);
    }
    componentWillUnmount() {
      console.log(`${this.getName()} componentWillUnmount`);
    }
  };
};
export default withLog;
