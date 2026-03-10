"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";
import { queryClient } from "./utils/query-client";

const inter = Inter({ subsets: ["latin"] });

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={(inter.className, playfair.className)}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
