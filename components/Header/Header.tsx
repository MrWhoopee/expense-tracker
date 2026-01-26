"use client";

import css from "./Header.module.css";
import { useUserStore } from "@/store/useUserStore";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import BurgerMenuBtn from "../BurgerMenuBtn/BurgerMenuBtn";
import Logo from "../Logo/Logo";

export default function Header() {
  const { isAuthenticated } = useUserStore();

  return (
    <header className={css.header}>
      <div
        className={`${css.headerContainer} ${!isAuthenticated ? css.isGuest : ""}`}
      >
        <div className={css.logoWrapper}>
          <Logo />
        </div>

        {isAuthenticated && (
          <div className={css.controls}>
            <div className={css.desktopNav}>
              <div className={css.navCenter}>
                <TransactionsHistoryNav />
              </div>
              <div className={css.userActions}>
                <UserBarBtn />
              </div>
            </div>
            <div className={css.mobileNav}>
              <BurgerMenuBtn />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
