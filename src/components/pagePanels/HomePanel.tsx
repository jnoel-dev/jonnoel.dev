import React from "react";
import Panel from "../panel/Panel";
import WinButton from "../winButton/WinButton";
import TitleBar from "../titlebar/Titlebar";

interface HomePanelProps {
  panelId: string;
}
export default function HomePanel({ panelId }: HomePanelProps) {
  return (
    <Panel width="auto" height="auto" connectedHref="/" panelId={panelId}>
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
}
