import React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroLint Pro - Premium React/Next.js Code Fixing Service",
  description:
    "Professional automated debugging service that safely fixes React/Next.js code. Never corrupts your code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
