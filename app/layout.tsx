import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Logo Crea App",
  description: "Ma première app NextJS",
  icons: {
    icon: "./logoCrea.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="cupcake">
      <body>{children}</body>
    </html>
  );
}
