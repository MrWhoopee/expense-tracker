import Link from "next/link";

export default function AuthNav() {
  return (
    <ul className="#">
      <li key={"sign-up"} className="#">
        <Link href="/sign-up" className="#">
          Sign Up
        </Link>
      </li>
      <li key={"sign-in"} className="#">
        <Link href="/sign-in" className="#">
          Sign In
        </Link>
      </li>
    </ul>
  );
}
