"use client";

import { useEffect, useState } from "react";
import css from "./Header.module.css";
import { useUserStore } from "@/store/useUserStore";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import BurgerMenuBtn from "../BurgerMenuBtn/BurgerMenuBtn";
import Logo from "../Logo/Logo";

export default function Header() {
  const { isAuthenticated } = useUserStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClasses = `
    ${css.header}
    ${isAuthenticated ? css.authBorder : ""}
    ${isScrolled ? css.scrolled : ""}
  `;

  const containerClasses = `
    ${css.headerContainer}
    ${!isAuthenticated ? css.isGuest : ""}
  `;

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
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
