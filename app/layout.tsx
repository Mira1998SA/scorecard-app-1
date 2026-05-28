import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AE Call Scorecard | Scale Army",
  description: "AI-powered sales call quality review for Scale Army AEs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
