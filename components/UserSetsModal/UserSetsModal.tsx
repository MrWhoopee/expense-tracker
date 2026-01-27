"use client";

import { useEffect, useRef, useState } from "react";
import { changeUser, updatePhoto, deletePhoto } from "@/lib/clientApi";
import { useUserStore } from "@/store/useUserStore";
import { useQueryClient } from "@tanstack/react-query";
import css from "./UserSetsModal.module.css";

interface Props {
  onClose: () => void;
}

export default function UserSetsModal({ onClose }: Props) {
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(
    user?.currency?.toUpperCase() || "USD",
  );
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDirty =
    name !== (user?.name || "") ||
    currency.toLowerCase() !== (user?.currency?.toLowerCase() || "usd");
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "UAH", symbol: "₴" },
  ];
  const currentCurrencyData =
    currencies.find((c) => c.code === currency) || currencies[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCurrency(user.currency?.toUpperCase() || "USD");
      setAvatarPreview(user.avatarUrl || "");
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await updatePhoto(formData as unknown as { avatarUrl: string });
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarPreview(newAvatarUrl);
      if (user) {
        setUser({
          ...user,
          avatarUrl: newAvatarUrl,
          name: name,
          currency: currency.toLowerCase(),
        });
      }
    } catch (error) {
      alert("Failed to upload photo");
    }
  };

  const handleAvatarRemove = async (): Promise<void> => {
    setAvatarPreview("");
    if (user) {
      setUser({
        ...user,
        avatarUrl: null,
        name: name,
        currency: currency.toLowerCase(),
      });
    }

    try {
      await deletePhoto(); //
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.log("Avatar removed successfully from server and store");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn("Server returned error, but UI remains updated.");
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        name: name.trim(),
        currency: currency.toLowerCase(),
      };

      await changeUser(updateData);
      if (user)
        setUser({
          ...user,
          name: updateData.name,
          currency: updateData.currency,
        }); // Оновлюємо глобальний стор
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      alert("Profile updated successfully!");
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Unknown error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (isDirty) {
        const confirmClose = window.confirm(
          "You have unsaved changes. Do you really want to leave?",
        );
        if (!confirmClose) return;
      }
      onClose();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeBtn} onClick={onClose}>
          <svg className={css.closeIcon} width="20" height="20">
            <use href="/img/sprite.svg#close-btn"></use>
          </svg>
        </button>

        <h2 className={css.title}>Profile Settings</h2>

        <div className={css.avatarSection}>
          <div className={css.avatarCircle}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="User" className={css.avatarImg} />
            ) : (
              <svg width="40" height="40" className={css.userIcon}>
                <use href="/img/sprite.svg#user-bold"></use>
              </svg>
            )}
          </div>
          <div className={css.avatarActions}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              hidden
              accept="image/*"
            />
            <button
              className={css.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload new photo
            </button>
            <button className={css.removeBtn} onClick={handleAvatarRemove}>
              Remove
            </button>
          </div>
        </div>

        <form
          className={css.userSetsForm}
          id="user-settings-form"
          onSubmit={handleSubmit}
        >
          <div className={css.customSelectContainer}>
            <button
              type="button"
              className={`${css.selectTrigger} ${isSelectOpen ? css.active : ""}`}
              onClick={() => setIsSelectOpen(!isSelectOpen)}
            >
              <span className={css.currentValue}>
                <span className={css.currencySymbol}>
                  {currentCurrencyData.symbol}
                </span>
                {currentCurrencyData.code}
              </span>

              <svg
                className={`${css.chevron} ${isSelectOpen ? css.rotate : ""}`}
                width="16"
                height="16"
              >
                <use href="/img/sprite.svg#chevron-down"></use>
              </svg>
            </button>

            {isSelectOpen && (
              <ul className={css.selectOptionsList}>
                {currencies.map((item) => (
                  <li
                    key={item.code}
                    className={css.optionItem}
                    onClick={() => {
                      setCurrency(item.code);
                      setIsSelectOpen(false);
                    }}
                  >
                    <span className={css.currencySymbol}>{item.symbol}</span>
                    {item.code}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className={css.inputWrapper}>
            <input
              className={css.inputField}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </form>
        <button
          className={css.saveBtn}
          type="submit"
          form="user-settings-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
