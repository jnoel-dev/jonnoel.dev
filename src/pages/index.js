import Defaults from "../components/defaults";
import Panel from "../components/panel/panel";
import WinButton from "../components/winButton/winButton";

function HomePage() {
  return (
    <>
      <Defaults />

      <Panel width={"auto"} height={"auto"}>
          <WinButton>about</WinButton>
          <WinButton>projects</WinButton>
          <WinButton>theme</WinButton>
      </Panel>
    </>
  );
}

export default HomePage;
