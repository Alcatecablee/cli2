// Test file with various issues for NeuroLint Pro to detect and fix

import React from 'react';

// HTML entity corruption (Layer 2)
const message = &quot;Hello &amp; welcome to our app&quot;;
const greeting = &#x27;Welcome back!&#x27;;

// Console.log usage (Layer 2)
console.log('Debug message');

// Missing key props in map (Layer 3)
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => <li>{item.name}</li>)}
    </ul>
  );
}

// Missing alt attributes (Layer 3)
function Gallery({ images }) {
  return (
    <div>
      {images.map(img => <img src={img.url} />)}
    </div>
  );
}

// Unguarded localStorage usage (Layer 4)
function ThemeToggle() {
  const savedTheme = localStorage.getItem('theme');
  
  return (
    <button onClick={() => {
      const newTheme = savedTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
    }}>
      Toggle Theme
    </button>
  );
}

// Missing React imports (Layer 3)
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default function App() {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
  
  const images = [
    { url: '/image1.jpg' },
    { url: '/image2.jpg' }
  ];
  
  return (
    <div>
      <h1>{message}</h1>
      <p>{greeting}</p>
      <ItemList items={items} />
      <Gallery images={images} />
      <ThemeToggle />
      <Counter />
    </div>
  );
}