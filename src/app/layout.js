import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import FloatingTimer from "@/components/FloatingTimer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Life OS - Your Personal Productivity Dashboard",
  description: "A modern Personal Dashboard Web App for daily productivity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: 'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: '400' }}
        suppressHydrationWarning
      >
        {children}
        <FloatingTimer />
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
