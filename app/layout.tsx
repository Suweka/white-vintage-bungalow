import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "White Vintage Bungalow - Heritage Hotel in Nuwara Eliya",
  description: "Experience colonial elegance in Sri Lanka's hill country. White Vintage Bungalow offers luxury accommodation with stunning tea plantation views in Nuwara Eliya.",
  keywords: ["hotel nuwara eliya", "sri lanka hotels", "heritage hotel", "colonial bungalow", "tea country accommodation"],
  authors: [{ name: "White Vintage Bungalow" }],
  openGraph: {
    title: "White Vintage Bungalow - Heritage Hotel",
    description: "Experience colonial elegance in Sri Lanka's hill country",
    url: "https://whitevintage.com",
    siteName: "White Vintage Bungalow",
    locale: "en_US",
    type: "website",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
