import TransactionsList from "@/components/TransactionsList/TransactionsList";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
// import { Suspense } from "react";
// import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import css from "@/app/transactions/history/[type]/page.module.css";
import { getTransactionByType } from "@/lib/serverApi";
// import Loader from "@/components/Loader/Loader";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface HistoryPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ date?: string; search?: string }>;
}

export default async function TransactionsHistoryPage({
  params,
  searchParams,
}: HistoryPageProps) {
  const { type } = await params;
  const { date, search } = await searchParams;

  const transactionType = type === "incomes" ? "incomes" : "expenses";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["transactions", transactionType],
    queryFn: () => getTransactionByType(transactionType),
  });

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

        <HydrationBoundary state={dehydrate(queryClient)}>
          <TransactionsList type={transactionType} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
