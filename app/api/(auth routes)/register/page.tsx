"use client";
import css from "./RegisterPage.module.css";

import Link from "next/link";

export default function SignUp() {
  const handleSubmit = () => {};

  return (
    <section className={css.mainContent}>
      <form action={handleSubmit} className={css.form}>
        <div className={css.logicalWrapper}>
          <h1 className={css.formTitle}>Sign up</h1>
          <p className={css.formWelcomeText}>
            Step into a world of hassle-free expense management! Your journey
            towards financial mastery begins here.
          </p>
        </div>

        <div className={css.logicalWrapper}>
          <label htmlFor="name" className={css.visuallyHidden}>
            Name
          </label>
          <input
            className={css.input}
            type="text"
            name="name"
            placeholder="Name"
            required
          />
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
            Email
          </label>
          <input
            className={css.input}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        <div className={css.logicalWrapper}>
          <button className={css.submitButton} type="submit">
            Sign up
          </button>

          <p className={css.actionText}>
            Already have account? &#160;
            <Link className={css.actionTextLink} href={`/login`}>
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
