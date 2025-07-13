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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: 1.6,
        }}
      >
        {children}
      </body>
    </html>
  );
}
