"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./TransactionsHistoryNav.module.css";

interface Props {
  onClick?: () => void;
}

export default function TransactionsHistoryNav({ onClick }: Props) {
  const pathname = usePathname();

  return (
    <nav className={css.transactionsNav}>
      <Link
        href={"/transactions/history/expenses"}
        className={`${css.transactionsLink} ${pathname === "/transactions/history/expenses" ? css.active : ""}`}
        onClick={onClick}
      >
        All expense
      </Link>
      <Link
        href={"/transactions/history/incomes"}
        className={`${css.transactionsLink} ${pathname === "/transactions/history/incomes" ? css.active : ""}`}
        onClick={onClick}
      >
        All income
      </Link>
    </nav>
  );
}
