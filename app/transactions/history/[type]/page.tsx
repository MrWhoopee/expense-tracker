import TransactionsList from "@/components/TransactionsList/TransactionsList";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import { Suspense } from "react";
// import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import css from "@/app/transactions/history/[type]/page.module.css";

// interface Props {
//   params: Promise<{ type: string }>;
// }

export default async function TransactionsHistoryPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  const transactionType = type === "income" ? "income" : "expense";

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
          <TransactionsList type={transactionType} />
        </Suspense>
      </div>
    </main>
  );
}
