import React, { useState } from "react";

const items = [
  { id: 1, name: "Test Item One" },
  { id: 2, name: "Test Item Two" },
  { id: 3, name: "Test Item Three" },
];

function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Component</h1>
      <p>Count: {count}</p>
      <ul>
        {items.map((item) => (
          <li>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default TestComponent;
