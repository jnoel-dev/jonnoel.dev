import React from "react";
import Panel from "../panel/panel";
import TitleBar from "../titlebar/titlebar";
import GifCard from "../gifcard/gifcard";

const UnderContructionPanel: React.FC = (): React.JSX.Element => {
  return (
    <Panel width="auto" height="auto" connectedHref="/" panelId="home">
      <TitleBar title="w e l c o m e" />
      <div className="grid grid-cols-3 place-items-center">
      <GifCard gifUrl="/images/nightsblink.gif" scale={1}  />
      <GifCard gifUrl="/images/webpageconstruction.gif" scale={.7}  />
      <GifCard gifUrl="/images/chaobig.gif" scale={1}  />
      </div>
      <TitleBar title="⋆⋅☆⋅⋆" />
    </Panel>
  );
};

export default UnderContructionPanel;
