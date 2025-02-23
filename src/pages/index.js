import Defaults from "../components/defaults";
import Panel from "../components/panel/panel";
import WinButton from "../components/winButton/winButton";
import styles from "../styles/home.module.css";

function HomePage() {
  return (
    <>
      <Defaults />

      <Panel width={"auto"} height={"auto"}>
        <h1 className={styles.h1}>───────── w e l c o m e ─────────</h1>
        <div className="flex items-center justify-center gap-2">
          <WinButton>about</WinButton>
          <WinButton>projects</WinButton>
          <WinButton>more</WinButton>
        </div>
        <h1 className={styles.h1}>──────────── ⋆⋅☆⋅⋆ ─────────────</h1>
      </Panel>
    </>
  );
}

export default HomePage;
