const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jetwhffgmohdqkuegtjh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldHdoZmZnbW9oZHFrdWVndGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzI0MjcsImV4cCI6MjA2NDY0ODQyN30.qdzOYox4XJQIadJlkg52bWjM1BGJd848ru0kobNmxiA";

async function testRLS() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log("Testing Supabase RLS...");

  // Test 1: Try to insert without authentication (should fail)
  console.log("\n1. Testing unauthenticated insert (should fail):");
  const { data: unauthData, error: unauthError } = await supabase
    .from("projects")
    .insert({
      user_id: "test-user-id",
      name: "Test Project",
      description: "This should fail",
      files: [],
    });

  if (unauthError) {
    console.log("✓ Unauthenticated insert correctly failed:");
    console.log("  Error:", unauthError.message);
    console.log("  Code:", unauthError.code);
  } else {
    console.log("✗ Unauthenticated insert unexpectedly succeeded");
  }

  // Test 2: Test login and authenticated insert
  console.log("\n2. Testing login...");
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: "test@example.com", // You'll need to create a test user
      password: "test123456",
    });

  if (authError) {
    console.log("✗ Login failed (you may need to create a test user):");
    console.log("  Error:", authError.message);
    return;
  }

  console.log("✓ Login successful");
  console.log("  User ID:", authData.user.id);

  // Test 3: Try authenticated insert
  console.log("\n3. Testing authenticated insert:");
  const { data: authInsertData, error: authInsertError } = await supabase
    .from("projects")
    .insert({
      user_id: authData.user.id,
      name: "Test Project - Authenticated",
      description: "This should work",
      files: [],
    })
    .select()
    .single();

  if (authInsertError) {
    console.log("✗ Authenticated insert failed:");
    console.log("  Error:", authInsertError.message);
    console.log("  Code:", authInsertError.code);
    console.log("  Details:", authInsertError.details);
  } else {
    console.log("✓ Authenticated insert successful:");
    console.log("  Project ID:", authInsertData.id);

    // Clean up
    console.log("\n4. Cleaning up test project...");
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", authInsertData.id);

    if (deleteError) {
      console.log("✗ Cleanup failed:", deleteError.message);
    } else {
      console.log("✓ Cleanup successful");
    }
  }
}

testRLS().catch(console.error);
