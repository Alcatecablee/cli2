import { useEffect } from "react";
import { usePathname } from "next/navigation";

"use client";


export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure DOM has updated after navigation
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
