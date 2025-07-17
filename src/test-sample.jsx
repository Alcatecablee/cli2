
function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hello & Welcome!</p>
      <p>This is a "test" component with <HTML> entities.</p>
      <p>Price: $99.99 €85.50</p>
      <p>Copyright © 2024 – All rights reserved.</p>
      <button onClick={() => setCount(count + 1)}>
        Count: {count} Click me!
      </button>
      <p>Special chars: § ¶ • ° ™</p>
    </div>
  );
}

export default MyComponent;
