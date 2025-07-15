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
    icon: "https://cdn.builder.io/api/v1/image/assets%2F4b35a64a4a2c446c91402681adcf734e%2F485afb87468542eeba91d45b141bab95?format=webp&width=32",
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
        <Script id="error-handler" strategy="beforeInteractive">
          {`
            // Global error handler for external services
            window.addEventListener('error', function(event) {
              if (event.error && event.error.message &&
                  (event.error.message.includes('Failed to fetch') ||
                   event.error.message.includes('fullstory') ||
                   event.error.message.includes('webpack'))) {
                console.warn('External service error caught:', event.error.message);
                event.preventDefault();
                return false;
              }
            });

            // Handle unhandled promise rejections from external services
            window.addEventListener('unhandledrejection', function(event) {
              if (event.reason && event.reason.message &&
                  (event.reason.message.includes('Failed to fetch') ||
                   event.reason.message.includes('fullstory') ||
                   event.reason.message.includes('webpack'))) {
                console.warn('External service promise rejection caught:', event.reason.message);
                event.preventDefault();
                return false;
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
