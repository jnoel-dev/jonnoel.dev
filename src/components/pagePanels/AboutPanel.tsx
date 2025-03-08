import React from "react";
import Panel from "../panel/Panel";
import TitleBar from "../titlebar/Titlebar";

interface AboutPanelProps {
  panelId: string;
}
export default function AboutPanel({ panelId }: AboutPanelProps) {
  return (
    <Panel
    panelId={panelId}
    width="auto"
    height="auto"
    bgcolor="globalColor6"
    connectedHref="/about"
  >
    <TitleBar title="about" />
    <h2>About Page Panel</h2>
    <p>This panel appears when visiting About!</p>
    <TitleBar title="⋆⋅☆⋅⋆" />
  </Panel>
  );
}
