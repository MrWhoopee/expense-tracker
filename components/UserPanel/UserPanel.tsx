"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import css from "./UserPanel.module.css";
import UserSetsModal from "../UserSetsModal/UserSetsModal";
import LogoutModal from "../LogoutModal/LogoutModal";
import { userLogout } from "@/lib/clientApi";
import { useUserStore } from "@/store/useUserStore";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  onClose: () => void;
}

export default function UserPanel({ onClose }: Props) {
  const router = useRouter();

  const { setUser } = useUserStore();
  const { theme, toggleTheme } = useTheme();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const [profileBtnText, setProfileBtnText] = useState("Profile settings");
  const [themeBtnText, setThemeBtnText] = useState("Dark theme");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkWidth = () => {
      const parent = containerRef.current?.parentElement;
      if (parent) {
        const width = parent.getBoundingClientRect().width;
        if (width < 150) {
          setProfileBtnText("Settings");
          setThemeBtnText(theme === "dark" ? "Light" : "Dark");
        } else {
          setProfileBtnText("Profile settings");
          setThemeBtnText(theme === "dark" ? "Light theme" : "Dark theme");
        }
      }
    };
    const observer = new ResizeObserver(() => checkWidth());

    const bar = document.querySelector('[class*="userBar"]');
    if (bar) observer.observe(bar);

    return () => {
      observer.disconnect();
    };
  }, [theme]);

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleCloseModals = () => {
    setIsProfileOpen(false);
    setIsLogoutOpen(false);
    onClose();
  };

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await userLogout();
      setUser(null);
      setIsLogoutOpen(false);
      onClose();
      // await logout();
      // clearIsAuthenticated();
      router.push("/");
    } catch (error) {
      console.log("logout failed:", error);
      setUser(null);
      // clearIsAuthenticated();
      router.push("/");
    }
  };

  return (
    <>
      <div ref={containerRef} className={css.panelWrapper}>
        <ul className={css.panelList}>
          <li className={css.panelItem}>
            <button
              type="button"
              className={css.panelBtn}
              onClick={toggleTheme}
            >
              <svg className={css.iconUser} width="16" height="16">
                <use
                  href={
                    theme === "dark"
                      ? "/img/sprite.svg#sun"
                      : "/img/sprite.svg#moon"
                  }
                ></use>
              </svg>
              <span>{themeBtnText}</span>
            </button>
          </li>
          <li className={css.panelItem}>
            <button
              type="button"
              className={css.panelBtn}
              onClick={handleProfileClick}
            >
              <svg className={css.iconUser} width="16" height="16">
                <use href="/img/sprite.svg#user"></use>
              </svg>
              <span>{profileBtnText}</span>
            </button>
          </li>
          <li className={css.panelItem}>
            <button
              type="button"
              className={css.panelBtn}
              onClick={handleLogoutClick}
            >
              <svg className={css.iconUser} width="16" height="16">
                <use href="/img/sprite.svg#log-out"></use>
              </svg>
              Log out
            </button>
          </li>
        </ul>
      </div>

      {isProfileOpen && <UserSetsModal onClose={handleCloseModals} />}

      {isLogoutOpen && (
        <LogoutModal
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={confirmLogout}
        />
      )}
    </>
  );
}
