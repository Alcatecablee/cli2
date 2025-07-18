"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately to dashboard
    router.push("/dashboard");
  }, [router]);

  // Show nothing while redirecting
  return null;
}
