"use client";

import Link from "next/link";
import css from "./TransactionsHistoryNav.module.css";

interface Props {
  onClick?: () => void;
}

export default function TransactionsHistoryNav({ onClick }: Props) {
  return (
    <nav className={css.transactionsNav}>
      <Link
        href={"/transactions/expense"}
        className={css.transactionsLink}
        onClick={onClick}
      >
        All expense
      </Link>
      <Link
        href={"/transactions/income"}
        className={css.transactionsLink}
        onClick={onClick}
      >
        All income
      </Link>
    </nav>
  );
}
