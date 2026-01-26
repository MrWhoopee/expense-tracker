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
        href={"/transactions/history/expenses"}
        className={css.transactionsLink}
        onClick={onClick}
      >
        All expenses
      </Link>
      <Link
        href={"/transactions/history/incomes"}
        className={css.transactionsLink}
        onClick={onClick}
      >
        All incomes
      </Link>
    </nav>
  );
}
