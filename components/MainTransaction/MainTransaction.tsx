import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import TransactionsChart from "@/components/TransactionsChart/TransactionsChart";
import TransactionForm from "@/components/TransactionForm/TransactionForm";

// import s from "./TransactionsPage.module.css";

export default function MainTransactions() {
  return (
    <div className="container">
      <section>
        <h1>Expenses Log</h1>
        <p>
          Capture and organize every penny spent with ease! A clear view of your
          financial habits at your fingertips.
        </p>
      </section>

      <div>
        {/* <ThemeToggler /> */}
        <TransactionsTotalAmount />
        <TransactionForm />
        <TransactionsChart />
      </div>
    </div>
  );
}
