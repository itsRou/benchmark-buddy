import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benchmark Buddy 🏆",
  description:
    "Give it any topic and Benchmark Buddy digs up the real numbers, ranks the contenders, and tells you which stats actually matter.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
