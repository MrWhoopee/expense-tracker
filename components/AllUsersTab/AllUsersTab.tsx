import Image from "next/image";
import css from "./AllUsersTab.module.css";

export default function AllUsersTab() {
  return (
    <div className={css.container}>
      <div className={css.avatarGroup}>
        <div className={css.avatarWrapper}>
          <Image
            src="/image1.png"
            width={48}
            height={48}
            alt="User 1"
            className={css.avatar}
          />
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src="/image2.png"
            width={48}
            height={48}
            alt="User 2"
            className={css.avatar}
          />
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src="/image3.png"
            width={48}
            height={48}
            alt="User 3"
            className={css.avatar}
          />
        </div>
      </div>

      <div className={css.textContent}>
        <h2 className={css.title}>1000 users +</h2>
        <p className={css.description}>
          Trusted by users for reliable expense tracking!
        </p>
      </div>
    </div>
  );
}
