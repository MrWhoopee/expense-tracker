import TransactionsTotalAmount from "@/components/TransactionsTotalAmount/TransactionsTotalAmount";
import TransactionsChart from "@/components/TransactionsChart/TransactionsChart";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import css from "./MainTransaction.module.css";

export default function MainTransactions() {
  return (
    <section className={css.container}>
      <h1 className={css.title}>Expenses Log</h1>
      <p className={css.description}>
        Capture and organize every penny spent with ease! A clear view of your
        financial habits at your fingertips.
      </p>
      <div className={css.totalWrapper}>
        <TransactionsTotalAmount />
      </div>
      <div className={css.formWrapper}>
        <TransactionForm />
      </div>

      <TransactionsChart />
    </section>
  );
}
