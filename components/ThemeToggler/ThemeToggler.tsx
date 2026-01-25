"use client";

import { useTheme } from "@/hooks/useTheme";
import { FiSun, FiMoon } from "react-icons/fi";
import css from "./ThemeToggler.module.css";

export const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();

  if (!theme) return null;

  const tooltipText =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      className={css.button}
      onClick={toggleTheme}
      aria-label={tooltipText}
      title={tooltipText}
    >
      {theme === "dark" ? (
        <FiSun className={css.iconSun} />
      ) : (
        <FiMoon className={css.iconMoon} />
      )}
    </button>
  );
};
