import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              color: "#fff",
              backgroundColor: "#17171a",
              borderRadius: "12px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#0EF387",
                secondary: "#fff",
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: "#E74A3B",
                secondary: "#fff",
              },
            },
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
