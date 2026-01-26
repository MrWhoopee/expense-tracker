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
      <h1 className={css.title}>
        {transactionType === "incomes" ? "All Incomes" : "All Expenses"}
      </h1>
      <p className={css.description}>
        {transactionType === "incomes"
          ? "Track and celebrate every bit of earnings effortlessly! Gain insights into your total revenue in a snap."
          : "View and manage every transaction seamlessly! Your entire financial landscape, all in one place."}
      </p>

      <div className={css.historyContent}>
        <TransactionsSearchTools />

        <Suspense fallback={<Loader />}>
          <TransactionsList data={data} />
        </Suspense>
      </div>
    </main>
  );
}
