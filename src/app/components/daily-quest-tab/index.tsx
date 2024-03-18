import styles from "./styles.module.scss";
import { QuestItem } from "..";

const DailyQuestTab = (props: any) => {
  const {} = props;

  return (
    <div role="tabpanel" className={["tab-content", styles["scoll-view-container"]].join(" ")}>
      <div className={[styles["scroll-view"]].join(" ")}>
        <QuestItem />

        <QuestItem />

        <QuestItem />

        <QuestItem />
      </div>
    </div>
  );
};

export default DailyQuestTab;
