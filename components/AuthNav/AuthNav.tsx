import Link from "next/link";
import css from "./AuthNav.module.css";

export default function AuthNav() {
  return (
    <ul className={css.navigationList}>
      <li>
        <Link href="/register" prefetch={false} className={css.signUpBtn}>
          Sign Up
        </Link>
      </li>

      <li>
        <Link href="/login" prefetch={false} className={css.signInBtn}>
          Sign In
        </Link>
      </li>
    </ul>
  );
}
