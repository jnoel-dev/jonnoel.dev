import Panel from "../panel/panel";
import WinButton from "../winButton/winButton";
import TitleBar from "../titlebar/titlebar";

export default function HomePanel({ children }) {

    return(
    <Panel width={"auto"} height={"auto"} openingDelay="2000" >
    <TitleBar title="w e l c o m e" />
    <div className="flex items-center justify-center gap-2 p-2">

      <WinButton href="/about" connectedPanelId="about">about</WinButton>

      <WinButton>projects</WinButton>

      <WinButton>more</WinButton>

    </div>
    <TitleBar title="⋆⋅☆⋅⋆" />
  </Panel>
    );
}
