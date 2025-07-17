const items = [
  { id: 1, name: &quot;React Component&quot; },
  { id: 2, name: &quot;Next.js App&quot; },
  { id: 3, name: &quot;TypeScript Fix&quot; }
];

function ItemList() {
  return (
    <ul>
      {items.map(item =>
        <li>{item.name}</li>
      )}
    </ul>
  );
}

console.log(&quot;Debug info&quot;);

export default ItemList;