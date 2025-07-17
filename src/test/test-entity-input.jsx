
function TestComponent() {
  const text = "Hello & Welcome!";
  const quote = ""test"";
  const html = "<HTML>";
  const price = "Price: $99.99";
  const copyright = "Copyright © 2024 – All rights reserved.";
  const special = "Special chars: § ¶ • ° ™";

  return (
    <div>
      <p>{text}</p>
      <p>
        This is a {quote} component with {html} entities.
      </p>
      <p>{price} €85.50</p>
      <p>{copyright}</p>
      <p>{special}</p>
    </div>
  );
}
