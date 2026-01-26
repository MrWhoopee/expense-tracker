"use client";

import css from "./WelcomePage.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
