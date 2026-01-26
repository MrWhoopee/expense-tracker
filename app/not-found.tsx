"use client";

import { Metadata } from "next";
import css from "../components/WelcomeContent/WelcomeContent.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Page not found | Expense Tracker",
  description: "Sorry, page you are looking for not found",
  openGraph: {
    title: "Page not found",
    description: "Sorry, page you are looking for not found",
    url: "https://expense-tracker.app/not-found",
    siteName: "Expense Tracker",
    images: [
      {
        url: "#",
        width: 1200,
        height: 630,
        alt: "page not found",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page not found",
    description: "Sorry, page you are looking for not found",
    images: ["#"],
  },
};

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={css["not-found-container"]}>
      <h1 className={css["main-title-accent"]}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
        <br />
        You will be redirected to the main page in a few seconds…
      </p>
    </div>
  );
}
