import type { Metadata } from "next";
import { Cinzel_Decorative, Cinzel } from "next/font/google";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Chroniques imprévisibles",
  description: "Suis ton intuition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${cinzelDecorative.variable}  ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
