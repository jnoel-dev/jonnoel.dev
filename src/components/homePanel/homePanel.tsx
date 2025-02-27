import React from "react";
import Panel from "../panel/panel";
import WinButton from "../winButton/winButton";
import TitleBar from "../titlebar/titlebar";

const HomePanel: React.FC = (): React.JSX.Element => {
  return (
    <Panel width="auto" height="auto" connectedHref="/" panelId="home">
      <TitleBar title="w e l c o m e" />
      <div className="flex items-center justify-center gap-2 p-2">
        <WinButton href="/about" connectedPanelId="about">
          about
        </WinButton>
        <WinButton>projects</WinButton>
        <WinButton>more</WinButton>
      </div>
      <TitleBar title="⋆⋅☆⋅⋆" />
    </Panel>
  );
};

export default HomePanel;
