import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { Toaster } from "react-hot-toast";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/favicon-dark.ico",
        href: "/images/favicon-dark.ico",
        type: "image/x-icon",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/favicon-light.svg",
        href: "/images/favicon-light.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              color: "#fff",
              backgroundColor: "#17171a",
              borderRadius: "12px",
              border: "1px solid #fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#0EF387",
                secondary: "#fff",
              },
              style: {
                border: "1px solid #0EF387",
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: "#E74A3B",
                secondary: "#fff",
              },
              style: {
                border: "1px solid #E74A3B",
              },
            },
          }}
        />
        <TanStackProvider>
          <AuthProvider>
            <ThemeProvider>
              <Header />
              <main>{children}</main>
            </ThemeProvider>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
