// import "./App.css";
import React from 'react';

import styles from "./app-styles.module.scss";
import { CDN_URL } from './common/const';
import { ClaimChestArea, DailyQuestTab } from "./app/components";

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
            <img src={`${CDN_URL}/images/svg/close.svg`} alt="Close" width={40} height={40} />
          </button>
        </div>
        <div className="navbar-center">
          <img src={`${CDN_URL}/images/svg/suzume-logo.svg`} alt="Suzume Logo" width={30} height={30} />
          <label className="text-xl ml-1">suzume</label>
        </div>
        <div className="navbar-end">
          <img src={`${CDN_URL}/images/img/coin.png`} alt="Coin" width={20} height={20} />
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
              <img src={`${CDN_URL}/images/svg/cards-chest.svg`} alt="Card" width={110} height={110} />
            </div>
          </div>

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

        <ClaimChestArea />
      </div>

      <div style={{height: '64px'}}></div>

      <div className={["btm-nav", styles["bottom-nav"]].join(" ")}>
        <button className="active">
        <img src={`${CDN_URL}/images/svg/home.svg`} alt="Close" width={25} height={25} />
          <span className="btm-nav-label">HOME</span>
        </button>
        <button>
        <img src={`${CDN_URL}/images/svg/wallet.svg`} alt="Close" width={25} height={25} />
          <span className="btm-nav-label">STATICS</span>
        </button>
      </div>
    </>
  );
}

export default App;
