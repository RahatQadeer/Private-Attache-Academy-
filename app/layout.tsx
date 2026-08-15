import "./globals.css";
import type { Metadata } from "next";
import { ProductionHostRedirect } from "@/base/components/ProductionHostRedirect";

export const metadata: Metadata = {
  title: "Private Attaché",
  description: "A new standard in professional coordination.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ProductionHostRedirect />
        {children}
      </body>
    </html>
  );
}
