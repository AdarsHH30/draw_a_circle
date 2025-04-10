import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Circle Quest - Retro Drawing Challenge",
  description: "Test your circle drawing skills in this retro pixel-art game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-pixel">{children}</body>
    </html>
  );
}
