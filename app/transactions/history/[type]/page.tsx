import TransactionsList from "@/components/TransactionsList/TransactionsList";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import { Suspense } from "react";
// import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import css from "@/app/transactions/history/[type]/page.module.css";

interface HistoryPageProps {
  params: Promise<{ type: string }>;
}

export default async function TransactionsHistoryPage({
  params,
}: HistoryPageProps) {
  const { type } = await params;

  const transactionType = type === "incomes" ? "incomes" : "expenses";

  const mockData = [
    {
      _id: "1",
      category: "Food",
      comment: "Dinner",
      date: "2026-01-25",
      time: "19:00",
      sum: "500",
      type: transactionType as "income" | "expense",
    },
  ];

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

        <Suspense fallback={<p>Loading transactions...</p>}>
          <TransactionsList type={transactionType} data={mockData} />
        </Suspense>
      </div>
    </main>
  );
}
