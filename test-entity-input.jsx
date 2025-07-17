function TestComponent() {
  const text = "Hello &amp; Welcome!";
  const quote = &quot;test&quot;;
  const html = "&lt;HTML&gt;";
  const price = "Price: &amp;#36;99.99";
  const copyright = "Copyright &copy; 2024 &ndash; All rights reserved.";
  const special = "Special chars: &sect; &para; &bull; &deg; &trade;";
  
  return (
    <div>
      <p>{text}</p>
      <p>This is a {quote} component with {html} entities.</p>
      <p>{price} €85.50</p>
      <p>{copyright}</p>
      <p>{special}</p>
    </div>
  );
}