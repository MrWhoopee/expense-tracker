"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/clientApi";
import css from "./TransactionsTotalAmount.module.css";

export default function TransactionsTotalAmount() {
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["user-info"],
    queryFn: getUser,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className={css.container}>
        <div className={`${css.item} ${css.skeleton}`}></div>
        <div className={`${css.item} ${css.skeleton}`}></div>
      </div>
    );
  }

  const incomes = userInfo?.transactionsTotal?.incomes ?? 0;
  const expenses = userInfo?.transactionsTotal?.expenses ?? 0;

  return (
    <div className={css.container}>
      {/* Блок Доходы */}
      <div className={css.item}>
        <div className={`${css.iconWrapper} ${css.iconIncome}`}>
          <svg className={css.icon}>
            <use href="/symbol-defs.svg#icon-Arrow-15" />
          </svg>
        </div>
        <div className={css.info}>
          <h3 className={css.title}>Total Income</h3>
          <p className={css.amount}>
            {`$${incomes.toLocaleString("en-US", { minimumFractionDigits: 3 })}`}
          </p>
        </div>
      </div>

      {/* Блок Расходы */}
      <div className={css.item}>
        <div className={`${css.iconWrapper} ${css.iconExpense}`}>
          <svg className={css.icon}>
            <use href="/symbol-defs.svg#icon-Arrow-14" />
          </svg>
        </div>
        <div className={css.info}>
          <h3 className={css.title}>Total Expense</h3>
          <p className={css.amount}>
            {`$${expenses.toLocaleString("en-US", { minimumFractionDigits: 3 })}`}
          </p>
        </div>
      </div>
    </div>
  );
}
