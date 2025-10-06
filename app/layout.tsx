import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Personality",
  description: "A minimalistic AI chat interface",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="touch-manipulation">{children}</body>
    </html>
  );
}

