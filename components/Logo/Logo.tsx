"use client";

import Link from "next/link";
import css from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href={"/"} className={css.logo} aria-label="Header">
      <svg className={css.logoMobile} width="199" height="22">
        <use href="/img/sprite.svg#logo-mobile"></use>
      </svg>
      <svg className={css.logoDesktop} width="217" height="24">
        <use href="/img/sprite.svg#logo"></use>
      </svg>
    </Link>
  );
}
