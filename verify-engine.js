console.log("Testing NeuroLint Pro standard engine...");

try {
  const NeuroLintPro = require("./neurolint-pro.js");

  console.log("✓ Engine imported successfully");
  console.log("✓ Engine type:", typeof NeuroLintPro);
  console.log(
    "✓ Has applyLayerTransformations:",
    typeof NeuroLintPro.applyLayerTransformations,
  );

  const testCode = `const App = () => { return <div>Hello World</div>; };`;

  console.log("Testing with sample code...");

  // Test with minimal parameters
  NeuroLintPro(testCode, "test.jsx", true, null, { isDemoMode: true })
    .then((result) => {
      console.log("✓ Engine executed successfully");
      console.log("✓ Result type:", typeof result);
      console.log("✓ Has success field:", "success" in result);
      console.log("✓ Has analysis field:", "analysis" in result);
      console.log("Engine working correctly!");
    })
    .catch((error) => {
      console.log("✗ Engine execution failed:", error.message);
      console.log("Stack:", error.stack);
    });
} catch (error) {
  console.log("✗ Engine import failed:", error.message);
  console.log("Stack:", error.stack);
}
