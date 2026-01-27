import TransactionsList from "@/components/TransactionsList/TransactionsList";
import TransactionsSearchTools from "@/components/TransactionsSearchTools/TransactionsSearchTools";
import css from "@/app/transactions/history/[type]/page.module.css";
import { getTransactionByType } from "@/lib/serverApi";
import { Suspense } from "react";
import { getTransactionByType } from "@/lib/serverApi";
import Loader from "@/components/Loader/Loader";
import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import css from "@/app/transactions/history/[type]/page.module.css";
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

  const queryKey = ["transactions", transactionType, date, search];

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () =>
      getTransactionByType({ type: transactionType, date, search }),
  });

  return (
    <main className={css.container}>
      <div className={css.topSection}>
        <div className={css.textBlock}>
          <h1 className={css.title}>
            {transactionType === "incomes" ? "All Income" : "All Expense"}
          </h1>
          <p className={css.description}>
            {transactionType === "incomes"
              ? "Track and celebrate every bit of earnings effortlessly! Gain insights into your total revenue in a snap."
              : "View and manage every transaction seamlessly! Your entire financial landscape, all in one place."}
          </p>
        </div>

        <div className={css.totalAmount}>
          <TransactionsTotalAmount />
        </div>
      </div>

      <div className={css.historyContent}>
        <TransactionsSearchTools />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <TransactionsList
            type={transactionType}
            date={date}
            search={search}
          />
        </HydrationBoundary>
      </div>
    </main>
  );
}
// export default async function TransactionsHistoryPage({
//   params,
// }: HistoryPageProps) {
//   const { type } = await params;

//   const transactionType = type === "incomes" ? "incomes" : "expenses";

//   const data = await getTransactionByType(transactionType);

//   return (
//     <main className={css.container}>
//       <h1 className={css.title}>
//         {transactionType === "incomes" ? "All Incomes" : "All Expenses"}
//       </h1>
//       <p className={css.description}>
//         {transactionType === "incomes"
//           ? "Track and celebrate every bit of earnings effortlessly! Gain insights into your total revenue in a snap."
//           : "View and manage every transaction seamlessly! Your entire financial landscape, all in one place."}
//       </p>
//       <TransactionsTotalAmount />
//       <div className={css.historyContent}>
//         <TransactionsSearchTools />

//         <Suspense fallback={<Loader />}>
//           <TransactionsList data={data} isLoading={false} />
//         </Suspense>
//       </div>
//     </main>
//   );
// }
