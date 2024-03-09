// import "./App.css";
import React from 'react';

import styles from "./app-styles.module.scss";

const ClaimChestButton = (props: any) => {
  const { isOpenChest = false, isNextChest = false, children, toolTipContent = "" } = props;

  return (
    <div
      className={[
        "btn",
        styles["chest-btn"],
        isOpenChest ? styles["chest-btn-open"] : styles["chest-btn-normal"],
        isNextChest ? styles["chest-btn-next"] : "",
      ].join(" ")}
    >
      {children}
      {isNextChest ? (
        <img src="/images/svg/next-chest.svg" alt="" height={40} width={40} />
      ) : (
        <img src="/images/svg/chest.svg" alt="" height={40} width={40} />
      )}

      {!!toolTipContent && 
        <div className={[styles["tooltiptext"]].join(" ")}>
          <span>{toolTipContent}</span>
        </div>
      }
    </div>
  );
};

const ClaimChestArea = (props: any) => {
  const {} = props

  return (
    <div className={styles["claim-chests"]}>
      <ClaimChestButton isOpenChest={true} toolTipContent={"Open"}>
        <label>Unlocked</label>
      </ClaimChestButton>
      <ClaimChestButton>
        <div className={styles["chest-title-area"]}>
          <img src="/images/svg/time.svg" alt="" height={15} width={15} />
          <label>9:30</label>
        </div>
      </ClaimChestButton>
      <ClaimChestButton toolTipContent={"Unlock"}>
        <div className={styles["chest-title-area"]}>
          <img src="/images/svg/time.svg" alt="" height={15} width={15} />
          <label>10m</label>
        </div>
      </ClaimChestButton>
      <ClaimChestButton isNextChest={true}>
        <div className={styles["next-chest-title-area"]}>
          <label>Next chest</label>
        </div>
      </ClaimChestButton>
    </div>
  );
};

const QuestItem = (props: any) => {
  const {} = props

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
            <img src={"/images/img/ticket.png"} alt="Suzume Ticket" width={25} height={25} />
          </div>
          {/* TICKET INFO */}
          <div className={["indicator", styles["info-indicator"]].join(" ")}>
            <div className={["indicator-item indicator-bottom", styles["info-indicator-bottom"]].join(" ")}>
              <span>x10</span>
            </div>
            <img src={"/images/img/coin.png"} alt="Suzume Coin" width={25} height={25} />
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

const DailyQuestTab = (props: any) => {
  const {} = props

  return (
    <div role="tabpanel" className={["tab-content", styles["scoll-view-container"]].join(" ")}>
      <div className={[styles["scroll-view"]].join(" ")}>
        <QuestItem />

        <QuestItem />

        <QuestItem />

        {/* <QuestItem /> */}
      </div>
    </div>
  );
};

function App() {
  const [isInit, setIsInit] = React.useState(true)

  const chooseTab = () => {
    isInit && setIsInit(false)
  }

  return (
    <>
      <div className={["navbar bg-base-100", styles["navbar"]].join(" ")}>
        <div className="navbar-start">
          <button className="btn btn-square btn-ghost">
            <img src={"/images/svg/close.svg"} alt="Close" width={40} height={40} />
          </button>
        </div>
        <div className="navbar-center">
          <img src={"/images/svg/suzume-logo.svg"} alt="Suzume Logo" width={30} height={30} />
          <label className="text-xl ml-1">suzume</label>
        </div>
        <div className="navbar-end">
          <img src={"/images/img/coin.png"} alt="Coin" width={20} height={20} />
          <label className="text-l">123</label>
        </div>
      </div>

      <div className={styles["body"]}>
        <div className={[styles["claim-quests"], "card bg-base-100"].join(" ")}>
          <div className={styles["quest-center-title"]}>
            <div className={styles["quest-center-left-area"]}>
              <h4 className={styles["title"]}>Quest Center</h4>
              <span className={styles["description"]}>Complete quests and earn rewards Quests refresh every day</span>
            </div>
            <div className={styles["quest-center-right-area"]}>
              <img src={"/images/svg/cards-chest.svg"} alt="Card" width={110} height={110} />
            </div>
          </div>

          {/* <div className="card-body p-0"> */}
            <div role="tablist" className={["tabs tabs-bordered", styles["quest-tabs"]].join(" ")}>
              {/* DAILY TAB */}
              <input type="radio" onClick={() => {setIsInit(true)}} name="quests_tab" role="tab" className="tab" aria-label="Daily" checked={isInit}/>
              <DailyQuestTab />

              {/* WEEKLY TAB */}
              <input type="radio" onClick={chooseTab} name="quests_tab" role="tab" className="tab" aria-label="Weekly" />
              <div role="tabpanel" className="tab-content p-10">Tab content 2</div>

              {/* ACHIVEMENTS TAB */}
              <input type="radio" onClick={chooseTab} name="quests_tab" role="tab" className="tab" aria-label="Achivements" />
              <div role="tabpanel" className="tab-content p-10">Tab content 3</div>

              {/* FEATURING TAB */}
              <input type="radio" onClick={chooseTab} name="quests_tab" role="tab" className="tab" aria-label="Featuring"/>
              <div role="tabpanel" className="tab-content p-10">Tab content 4</div>
            </div>
          </div>
        {/* </div> */}

        <ClaimChestArea />
      </div>

      <div className={["btm-nav", styles["bottom-nav"]].join(" ")}>
        <button className="active">
        <img src={"/images/svg/home.svg"} alt="Close" width={25} height={25} />
          <span className="btm-nav-label">HOME</span>
        </button>
        <button>
        <img src={"/images/svg/wallet.svg"} alt="Close" width={25} height={25} />
          <span className="btm-nav-label">STATICS</span>
        </button>
      </div>
    </>
  );
}

export default App;
