import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netfix Movie Clone",
  description: "A Netflix-style movie catalog built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
