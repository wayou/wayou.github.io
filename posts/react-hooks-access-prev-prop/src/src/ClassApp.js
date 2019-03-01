import React, { Component } from 'react';

class Counter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: props.initialCount
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.initialCount !== this.props.initialCount) {
      this.setState({
        count: nextProps.initialCount
      })
    }
  }

  setCount = (count) => {
    this.setState({
      count
    })
  }

  render() {
    const { count } = this.state;
    return <div>
      <p>counter2:{count}</p>
      <div>
        <button onClick={() => { this.setCount(count + 1) }} >+</button>
      </div >
    </div >
  }

}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }
  setCount = (count) => {
    this.setState({
      count
    })
  }
  render() {
    const count = this.state.count;
    return (
      <div className="App" >
        <h3>class ver</h3>
        <p>counter1:{count}</p>
        <div>
          <button onClick={() => { this.setCount(count + 1) }}>+</button>
        </div>
        <hr />
        <Counter initialCount={count}></Counter>
      </div>
    );
  }
}

export default App;
