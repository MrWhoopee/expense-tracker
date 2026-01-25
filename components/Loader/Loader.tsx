"use client";

import css from "./Loader.module.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className={css.wrapper}>
      <div className={css.spinner}></div>
      <p className={css.text}>{text}</p>
    </div>
  );
}
