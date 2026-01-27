"use client";

import { useState } from "react";
import css from "./BurgerMenuBtn.module.css";
import BurgerMenu from "../BurgerMenu/BurgerMenu";

export default function BurgerMenuBtn() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const openMenu = () => setIsBurgerOpen(true);
  const closeMenu = () => setIsBurgerOpen(false);

  return (
    <>
      <button type="button" className={css.burgerBtn} onClick={openMenu}>
        <svg width="36" height="36">
          <use href="/img/sprite.svg#burger-menu"></use>
        </svg>
      </button>

      {isBurgerOpen && <BurgerMenu onClose={closeMenu} />}
    </>
  );
}
