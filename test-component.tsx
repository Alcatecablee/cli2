import React, { useState } from 'react';

const items = [
  { id: 1, name: &quot;Test Item One&quot; },
  { id: 2, name: &quot;Test Item Two&quot; },
  { id: 3, name: &quot;Test Item Three&quot; }
];

function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test Component</h1>
      <p>Count: {count}</p>
      <ul>
        {items.map(item => 
          <li>{item.name}</li>
        )}
      </ul>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default TestComponent;