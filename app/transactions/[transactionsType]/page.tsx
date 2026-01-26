import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import TransactionsChart from "@/components/TransactionsChart/TransactionsChart";
import TransactionForm from "@/components/TransactionForm/TransactionForm";

// import s from "./TransactionsPage.module.css";
import { ThemeToggler } from "../../../components/ThemeToggler/ThemeToggler";

export default async function MainTransactionsPage({
  params,
}: {
  params: Promise<{ transactionsType: string }>;
}) {
  const { transactionsType } = await params;

  return (
    <div className="container">
      <section>
        <h1>{transactionsType === "incomes" ? "Incomes" : "Expenses"} Log</h1>
        <p>
          Capture and organize every penny spent with ease! A clear view of your
          financial habits at your fingertips.
        </p>
      </section>

      <div>
        {/* <ThemeToggler /> */}
        <TransactionsTotalAmount />
        <TransactionForm />
        {transactionsType === "expenses" && <TransactionsChart />}
      </div>
    </div>
  );
}
