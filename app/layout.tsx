import type { Metadata } from "next";
import { Newsreader, Nunito } from "next/font/google";
import "./globals.css";

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const sans = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Civic Signal — Cambridge",
  description:
    "What your government is doing — and what it means for you. We don't tell you how to vote.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-page-light text-body-light">
        {children}
      </body>
    </html>
  );
}
