import React, { Component } from "react";

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <h1>Dashbaord</h1>
        <table>
          {this.props.data.map(row => {
            return (
              <tr>
                <td>{row.name}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}

export default Dashboard;
