import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const incrementCount = (val) => {
    setCount(count + val);
  }

  return (
    <div className="app">
        <main>
          <div className="location">
            Cevo BusyPlace
          </div>
          <div className="current-count">
            <div className={(count < 50) ? "value safe" : (count > 90) ? "value danger" : "value warn"}>{count}</div>
          </div>
          <div className="add-buttons">
            <button onClick={e => incrementCount(1)}>+1</button>
            <button onClick={e => incrementCount(2)}>+2</button>
            <button onClick={e => incrementCount(5)}>+5</button>
          </div>
          <div className="remove-buttons">
            <button onClick={e => incrementCount(-1)}>-1</button>
            <button onClick={e => incrementCount(-2)}>-2</button>
            <button onClick={e => incrementCount(-5)}>-5</button>
          </div>
        </main>
    </div>
  );
}

export default App;
