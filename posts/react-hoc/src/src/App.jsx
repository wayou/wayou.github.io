import React, { Component } from "react";
import Dashboard from "./Dashboard";
import withAuth from "./withAuth";
import withData from "./withData";

const WrappedDashboard = withData(withAuth(Dashboard));

class App extends Component {
  render() {
    return (
      <div className="app">
        <WrappedDashboard
          api={"api/to/fetch/dashboard/data"}
        />
      </div>
    );
  }
}

export default App;
