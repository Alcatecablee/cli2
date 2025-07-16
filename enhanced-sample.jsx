const items = [
  { id: 1, name: "React Component" },
  { id: 2, name: "Next.js App" },
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
