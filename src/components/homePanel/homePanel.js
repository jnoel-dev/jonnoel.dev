import Panel from "../panel/panel";
import WinButton from "../winButton/winButton";
import styles from "./homePanel.module.css";

export default function HomePanel({ children }) {

    return(
    <Panel width={"auto"} height={"auto"}>
    <h1 className={styles.h1}>───────── w e l c o m e ─────────</h1>
    <div className="flex items-center justify-center gap-2">

      <WinButton href="/about">about</WinButton>

      <WinButton>projects</WinButton>

      <WinButton>more</WinButton>

    </div>
    <h1 className={styles.h1}>──────────── ⋆⋅☆⋅⋆ ─────────────</h1>
  </Panel>
    );
}
