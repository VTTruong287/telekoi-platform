import { ClaimChestButton } from "..";
import { CDN_URL } from "../../../common/const";
import styles from "./styles.module.scss";

const ClaimChestArea = (props: any) => {
  const {} = props;

  return (
    <div className={styles["claim-chests"]}>
      <ClaimChestButton isOpenChest={true} toolTipContent={"Open"}>
        <label>Unlocked</label>
      </ClaimChestButton>
      <ClaimChestButton>
        <div className={styles["chest-title-area"]}>
          <img src={`${CDN_URL}/images/svg/time.svg`} alt="" height={15} width={15} />
          <label>9:30</label>
        </div>
      </ClaimChestButton>
      <ClaimChestButton toolTipContent={"Unlock"}>
        <div className={styles["chest-title-area"]}>
          <img src={`${CDN_URL}/images/svg/time.svg`} alt="" height={15} width={15} />
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

export default ClaimChestArea;
