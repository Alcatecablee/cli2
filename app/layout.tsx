import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "../lib/auth-context";
import { AuthErrorBoundary } from "../lib/auth-error-boundary";
import { AuthErrorHandler } from "../lib/auth-error-handler";
import ScrollToTop from "../src/components/ScrollToTop";
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
      <body suppressHydrationWarning={true}>
        <ScrollToTop />
        {/* Space Shooting Stars */}
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <AuthErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </AuthErrorBoundary>
        <Analytics />
        <SpeedInsights />
        <Script
          src="https://www.paypal.com/sdk/js?client-id=AaZabZwUPYitlE5MOXwohkXxtMzI7GaSArFxw7JYMIDfZE_PHvsMzY1WEsZk_QwTdek4SEpjj_DC5ys7&currency=USD&intent=capture&enable-funding=venmo,card"
          strategy="lazyOnload"
        />
        <Script id="error-handler" strategy="beforeInteractive">
          {`
            // Global error handler for external services and Next.js dev issues
            window.addEventListener('error', function(event) {
              if (event.error && event.error.message &&
                  (event.error.message.includes('Failed to fetch') ||
                   event.error.message.includes('fullstory') ||
                   event.error.message.includes('webpack') ||
                   event.error.message.includes('RSC payload') ||
                   event.error.message.includes('Fast Refresh') ||
                   event.error.message.includes('fetchServerResponse'))) {
                console.warn('Development service error caught:', event.error.message);
                event.preventDefault();
                return false;
              }
            });

            // Handle unhandled promise rejections from external services and Next.js
            window.addEventListener('unhandledrejection', function(event) {
              if (event.reason && event.reason.message &&
                  (event.reason.message.includes('Failed to fetch') ||
                   event.reason.message.includes('fullstory') ||
                   event.reason.message.includes('webpack') ||
                   event.reason.message.includes('RSC payload') ||
                   event.reason.message.includes('Fast Refresh') ||
                   event.reason.message.includes('fetchServerResponse'))) {
                console.warn('Development promise rejection caught:', event.reason.message);
                event.preventDefault();
                return false;
              }
            });

                        // Override fetch to handle dev server connectivity issues
            if (typeof window !== 'undefined') {
              const originalFetch = window.fetch;
              window.fetch = function(...args) {
                return originalFetch.apply(this, args).catch(error => {
                  if (error.message && error.message.includes('Failed to fetch')) {
                    console.warn('Development fetch error suppressed:', error.message);
                    return new Response('{}', { status: 200 });
                  }
                  throw error;
                });
              };
            }
          `}
        </Script>
      </body>
    </html>
  );
}
