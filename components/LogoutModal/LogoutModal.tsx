"use client";

import MainModal from "../MainModal/MainModal";
import css from "./LogoutModal.module.css";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ onClose, onConfirm }: Props) {
  return (
    <MainModal onClose={onClose}>
      <div className={css.modalContent}>
        <button className={css.closeBtn} onClick={onClose}>
          <svg width="20" height="20">
            <use href="/img/sprite.svg#close-btn"></use>
          </svg>
        </button>
        <h2 className={css.title}>Are you sure you want to log out?</h2>
        <div className={css.btnWrapper}>
          <button className={css.logoutBtn} onClick={onConfirm}>
            Log out
          </button>
          <button className={css.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
      {/* <div
        className={css.backdrop}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      > */}
      {/* <div className={css.modal}> */}

      {/* </div> */}
      {/* // </div> */}
    </MainModal>
  );
}
