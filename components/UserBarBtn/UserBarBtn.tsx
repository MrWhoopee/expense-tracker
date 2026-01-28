"use client";

import { useState, useEffect, useRef } from "react";
import UserPanel from "../UserPanel/UserPanel";
import { useUserStore } from "@/store/useUserStore";
import css from "./UserBarBtn.module.css";

interface Props {
  onAction?: () => void;
}

export default function UserBarBtn({ onAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const username = user?.name || "User";
  const userAvatar = user?.avatarUrl;

  const togglePanel = () => setIsOpen((prev) => !prev);

  const handlePanelClose = () => {
    setIsOpen(false);
    onAction?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={css.relativeWrapper} ref={containerRef}>
      <button className={css.userBar} type="button" onClick={togglePanel}>
        <div className={css.avatarThumb}>
          {userAvatar ? (
            <img src={userAvatar} alt={username} className={css.avatarImg} />
          ) : (
            <span className={css.avatarLetter}>
              {username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <span className={css.username}>{username}</span>

        <svg
          className={`${css.chevron} ${isOpen ? css.rotate : ""}`}
          width="20"
          height="20"
        >
          <use href="/img/sprite.svg#chevron-down"></use>
        </svg>
      </button>

      {isOpen && <UserPanel onClose={handlePanelClose} />}
    </div>
  );
}
