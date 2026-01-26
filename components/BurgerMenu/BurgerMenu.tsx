"use client";

import { useEffect } from "react";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import css from "./BurgerMenu.module.css";
import UserBarBtn from "../UserBarBtn/UserBarBtn";

interface Props {
  onClose: () => void;
}
export default function BurgerMenu({ onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        return onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);
  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose}>
          <svg className="" width="20" height="20">
            <use href="/img/sprite.svg#close-btn-mobile"></use>
          </svg>
        </button>

        <div className={css.userWrapper}>
          <UserBarBtn onAction={onClose} />
        </div>

        <div className={css.navWrapper}>
          <TransactionsHistoryNav onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
