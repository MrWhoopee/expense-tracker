import Link from "next/link";
import css from "./AuthNav.module.css";

export default function AuthNav() {
  return (
    <ul className={css.navigationList}>
      <li className={css.signUpBtn}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign Up
        </Link>
      </li>

      <li className={css.signInBtn}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Sign In
        </Link>
      </li>
    </ul>
  );
}
