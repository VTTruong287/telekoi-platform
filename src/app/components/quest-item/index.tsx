import { CDN_URL } from "../../../common/const";
import styles from "./styles.module.scss";

const QuestItem = (props: any) => {
  const {} = props;

  return (
    <div className={["card", styles["quest-item"]].join(" ")}>
      {/* QUEST TITLE */}
      <div className={[styles["quest-item-title"]].join(" ")}>
        <label>Login Bonus</label>
      </div>
      {/* QUEST PROGESS */}
      <div className={[styles["quest-item-progress"]].join(" ")}>
        <progress className="progress progress-info w-100" value="100" max="100"></progress>
        <span className={[styles["counter"]].join(" ")}>1/1</span>
      </div>
      <div className={[styles["quest-item-info-n-actions"]].join(" ")}>
        <div className={[styles["info"]].join(" ")}>
          {/* COIN INFO */}
          <div className={["indicator", styles["info-indicator"]].join(" ")}>
            <div className={["indicator-item indicator-bottom", styles["info-indicator-bottom"]].join(" ")}>
              <span>x10</span>
            </div>
            <img src={`${CDN_URL}/images/img/ticket.png`} alt="Suzume Ticket" width={25} height={25} />
          </div>
          {/* TICKET INFO */}
          <div className={["indicator", styles["info-indicator"]].join(" ")}>
            <div className={["indicator-item indicator-bottom", styles["info-indicator-bottom"]].join(" ")}>
              <span>x10</span>
            </div>
            <img src={`${CDN_URL}/images/img/coin.png`} alt="Suzume Coin" width={25} height={25} />
          </div>
        </div>
        {/* CLAIM BUTTON */}
        <div className={[styles["action"]].join(" ")}>
          <button className="btn">Claim</button>
        </div>
      </div>
    </div>
  );
};

export default QuestItem;
