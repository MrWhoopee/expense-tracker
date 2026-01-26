import TransactionsList from "@/components/TransactionsList/TransactionsList";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import { Suspense } from "react";
// import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import css from "@/app/transactions/history/[type]/page.module.css";
import { getTransactionByType } from "@/lib/serverApi";
import Loader from "@/components/Loader/Loader";

interface HistoryPageProps {
  params: Promise<{ type: string }>;
}

export default async function TransactionsHistoryPage({
  params,
}: HistoryPageProps) {
  const { type } = await params;

  const transactionType = type === "incomes" ? "incomes" : "expenses";

  const data = await getTransactionByType(transactionType);

  return (
    <main className={css.container}>
      {/* <header className={css.header}>
        <div className={css.titleWrapper}>
          <h1 className={css.title}>{title}</h1>
          <p className={css.description}>{description}</p>
        </div>

        <TransactionsTotalAmount type={transactionType} />
      </header> */}

      <div className={css.historyContent}>
        <TransactionsSearchTools />

        <Suspense fallback={<Loader />}>
          <TransactionsList data={data} />
        </Suspense>
      </div>
    </main>
  );
}
