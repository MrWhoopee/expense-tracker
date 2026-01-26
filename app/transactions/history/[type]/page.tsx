import TransactionsList from "@/components/TransactionsList/TransactionsList";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import { Suspense } from "react";
// import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import css from "@/app/transactions/history/[type]/page.module.css";

interface HistoryPageProps {
  params: Promise<{ type: string }>;
}

export default async function TransactionsHistoryPage(
  params: HistoryPageProps,
) {
  const { type } = await params.params;

  const transactionType = type === "income" ? "income" : "expense";

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
      {/* <header className={css.header}>
        <div className={css.titleWrapper}>
          <h1 className={css.title}>{title}</h1>
          <p className={css.description}>{description}</p>
        </div>

        <TransactionsTotalAmount type={transactionType} />
      </header> */}

      <div className={css.historyContent}>
        <TransactionsSearchTools />

        <Suspense fallback={<p>Loading transactions...</p>}>
          <TransactionsList type={transactionType} data={mockData} />
        </Suspense>
      </div>
    </main>
  );
}
