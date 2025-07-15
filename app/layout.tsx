import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "../lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroLint Pro - Premium React/Next.js Code Fixing Service",
  description:
    "Professional automated debugging service that safely fixes React/Next.js code. Never corrupts your code.",
  icons: {
    icon: "/favico.png",
  },
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Script
          src="https://www.paypal.com/sdk/js?client-id=AaZabZwUPYitlE5MOXwohkXxtMzI7GaSArFxw7JYMIDfZE_PHvsMzY1WEsZk_QwTdek4SEpjj_DC5ys7&currency=USD&intent=capture&enable-funding=venmo,card"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
