import React, { useState, useRef, useEffect } from 'react';

function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount)
  const prevCountRef = useRef(initialCount);
  useEffect(() => {
    prevCountRef.current = initialCount;
  })

  if (initialCount !== prevCountRef.current && count !== initialCount) {
    setCount(initialCount)
  }
  
  return <div>
    <p>counter2:{count}</p>
    <div>
      <button onClick={() => { setCount(count + 1) }}>+</button>
    </div >
  </div >
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <h3>hook ver</h3>
      <p>counter1:{count}</p>
      <div>
        <button onClick={() => { setCount(count + 1) }}>+</button>
      </div>
      <Counter initialCount={count}></Counter>
    </div>
  );
}

export default App;
