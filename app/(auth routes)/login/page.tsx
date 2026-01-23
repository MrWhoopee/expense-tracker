"use client";
import css from "./LoginPage.module.css";
import Link from "next/link";

export default function SignIn() {
  const handleSubmit = () => {};

  return (
    <section className={css.mainContent}>
      <form action={handleSubmit} className={css.form}>
        <div className={css.logicalWrapper}>
          <h1 className={css.formTitle}>Sign in</h1>
          <p className={css.formWelcomeText}>
            Welcome back to effortless expense tracking! Your financial
            dashboard awaits.
          </p>
        </div>
        <div className={css.logicalWrapper}>
          <label htmlFor="email" className={css.visuallyHidden}>
            Email
          </label>
          <input
            className={css.input}
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <label htmlFor="password" className={css.visuallyHidden}>
            Password
          </label>
          <input
            className={css.input}
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={8}
          />
        </div>
        <div className={css.logicalWrapper}>
          <button className={css.submitButton} type="submit">
            Sign in
          </button>
          <p className={css.actionText}>
            Don`t have an account? &#160;
            <Link className={css.actionTextLink} href={`/register`}>
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
