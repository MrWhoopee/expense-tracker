"use client";

import Link from "next/link";
import css from "./TransactionsHistoryNav.module.css";
import { usePathname } from "next/navigation";

interface Props {
  onClick?: () => void;
}

export default function TransactionsHistoryNav({ onClick }: Props) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname?.includes(path);

  return (
    <nav className={css.transactionsNav}>
      <Link
        href={"/transactions/history/expenses"}
        className={`${css.transactionsLink} ${isActive("expenses") ? css.active : ""}`}
        onClick={onClick}
      >
        All expenses
      </Link>
      <Link
        href={"/transactions/history/incomes"}
        className={`${css.transactionsLink} ${isActive("incomes") ? css.active : ""}`}
        onClick={onClick}
      >
        All incomes
      </Link>
    </nav>
  );
}
