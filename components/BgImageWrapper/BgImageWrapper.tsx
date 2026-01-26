import css from "./BgImageWrapper.module.css";

export default function BgImageWrapper() {
  return (
    <div className={css.bgImgWrapper}>
      <div className={css.infoCard}>
        <div className={css.infoCardGrowth}>
          <svg className={css.icon}>
            <use href="/bgImage.svg#icon-arrow-up-right"></use>
          </svg>
        </div>

        <div className={css.infoCardBalance}>
          <p className={css.infoCardLabelBalance}>Your balance</p>
          <p className={css.infoCardBalanceAmount}>$632.000</p>
        </div>

        <div className={css.infoCardPercentWrapper}>
          <p className={css.infoCardPercent}>+1.29%</p>
        </div>
      </div>
    </div>
  );
}
