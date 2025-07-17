const items = [
  { id: 1, name: "React Component" },
  { id: 2, name: "Next.js App" },
  { id: 3, name: "TypeScript Fix" },
];

function ItemList() {
  return (
    <ul>
      {items.map((item) => (
        <li>{item.name}</li>
      ))}
    </ul>
  );
}

console.log("Debug info");

export default ItemList;
