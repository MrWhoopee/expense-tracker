import AuthNav from "@/components/AuthNav/AuthNav";
import css from "./WelcomePage.module.css";
import AllUsersTab from "@/components/AllUsersTab/AllUsersTab";

export default function WelcomePage() {
  return (
    <div className={css.container}>
      <p className={css.title}>Expense log</p>
      <div className={css.wrapper}>
        <h1 className={css["main-title"]}>
          Manage Your{" "}
          <span className={css["main-title-accent"]}>Finances </span>
          Masterfully!
        </h1>
        <p className={css.description}>
          ExpenseTracker effortlessly empowers you to take control of your
          finances! With intuitive features, it simplifies the process of
          tracking and managing expenses, allowing for a stress-free mastery
          over your financial world.
        </p>
      </div>
      <AuthNav />
      <AllUsersTab />
    </div>
  );
}
