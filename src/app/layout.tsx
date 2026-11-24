import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Intelligence Platform",
  description:
    "Discover, compare and evaluate AI models from leading providers. Find the best model for your use case with pricing, benchmarks, and capability comparisons.",
  keywords: "AI models, LLM comparison, GPT, Claude, Gemini, AI pricing, benchmarks",
  openGraph: {
    title: "OneAtlas — AI Model Intelligence Platform",
    description: "Discover and compare AI models from leading providers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
