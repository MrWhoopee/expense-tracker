"use client";

import { useEffect, useState } from "react";
import css from "./Header.module.css";
import { useUserStore } from "@/store/useUserStore";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import BurgerMenuBtn from "../BurgerMenuBtn/BurgerMenuBtn";
import Logo from "../Logo/Logo";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import UserSetsModal from "../UserSetsModal/UserSetsModal";
import LogoutModal from "../LogoutModal/LogoutModal";
import { userLogout } from "@/lib/clientApi";
import { useRouter } from "next/navigation";

interface OpenModalEvent extends CustomEvent {
  detail: "profile" | "logout";
}

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, setUser } = useUserStore();
  const [isScrolled, setIsScrolled] = useState(false);

  const [activeModal, setActiveModal] = useState<"profile" | "logout" | null>(
    null,
  );
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as OpenModalEvent;
      setActiveModal(customEvent.detail);
    };
    window.addEventListener("open-modal", handleOpenModal);
    return () => window.removeEventListener("open-modal", handleOpenModal);
  }, []);

  const handleLogout = async () => {
    try {
      await userLogout();
      setUser(null);
      setActiveModal(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

      {isBurgerOpen && <BurgerMenu onClose={() => setIsBurgerOpen(false)} />}

      {/* {activeModal === "profile" && (
        <UserSetsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "logout" && (
        <LogoutModal
          onClose={() => setActiveModal(null)}
          onConfirm={handleLogout}
        />
      )} */}

      {activeModal === "profile" && (
        <UserSetsModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "logout" && (
        <LogoutModal
          onClose={() => setActiveModal(null)}
          onConfirm={handleLogout}
        />
      )}
    </header>
  );
}
