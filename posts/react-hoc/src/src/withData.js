import React, { Component } from "react";

const withData = WrappedComponent => {
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
      return <WrappedComponent {...this.props} data={this.state.data} />;
    }
  };
};
export default withData;
