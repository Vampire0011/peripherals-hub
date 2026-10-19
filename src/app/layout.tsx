import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "PeripheralsHub — Best Mice & Keyboards, Auto-Tracked",
  description:
    "Curated, auto-updating catalog of the best gaming and productivity mice and keyboards with live price tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-border py-8">
          <div className="container flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} PeripheralsHub. All product links go to third-party retailers.</p>
            <p>Prices auto-synced. As an affiliate, we may earn on qualifying purchases.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
