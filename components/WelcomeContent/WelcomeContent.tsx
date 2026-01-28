import css from "./WelcomeContent.module.css";
import BgImageWrapper from "@/components/BgImageWrapper/BgImageWrapper";
import AuthNav from "@/components/AuthNav/AuthNav";
import AllUsersTab from "@/components/AllUsersTab/AllUsersTab";

export default function WelcomeContent() {
  return (
    <div className={css.container}>
      <BgImageWrapper />
      <div className={css["content-wrapper"]}>
        <p className={css.title}>Expense log</p>
        <div className={css["text-wrapper"]}>
          <h1 className={css["main-title"]}>
            Manage Your{" "}
            <span className={css["main-title-accent"]}>Finances</span>{" "}
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
    </div>
  );
}
