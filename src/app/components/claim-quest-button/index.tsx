import { CDN_URL } from "../../../common/const";
import styles from "./styles.module.scss";

const ClaimChestButton = (props: any) => {
  const { isOpenChest = false, isNextChest = false, children, toolTipContent = "" } = props;

  return (
    <div
      className={[
        "btn",
        isOpenChest ? styles["chest-btn-open"] : styles["chest-btn-normal"],
        isNextChest ? styles["chest-btn-next"] : "",
        styles["chest-btn"],
      ].join(" ")}
    >
      {children}
      {isNextChest ? (
        <img src={`${CDN_URL}/images/svg/next-chest.svg`} alt="" height={40} width={40} />
      ) : (
        <img src={`${CDN_URL}/images/svg/chest.svg`} alt="" height={40} width={40} />
      )}

      {!!toolTipContent && (
        <div className={[styles["tooltiptext"]].join(" ")}>
          <span>{toolTipContent}</span>
        </div>
      )}
    </div>
  );
};

export default ClaimChestButton;
