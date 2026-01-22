import Link from "next/link";
import css from "./AuthNav.module.css";

export default function AuthNav() {
  return (
    <ul className={css.navigationList}>
      <li className={css.signUpBtn}>
        <Link href="/register" prefetch={false} className={css.navigationLink}>
          Sign Up
        </Link>
      </li>

      <li className={css.signInBtn}>
        <Link href="/login" prefetch={false} className={css.navigationLink}>
          Sign In
        </Link>
      </li>
    </ul>
  );
}
