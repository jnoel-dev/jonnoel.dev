import { useEffect, useRef } from "react";
import { useGlobalComponents } from "../components/globalComponentsContext/globalComponentsContext";
import Panel from "../components/panel/panel";
import TitleBar from "../components/titlebar/titlebar";

export default function AboutPage() {
  const { addComponent, removeComponent, shouldRemoveComponent } = useGlobalComponents();
  const panelId = "about";


  const shouldRemoveComponentRef = useRef(shouldRemoveComponent);

  useEffect(() => {
    shouldRemoveComponentRef.current = shouldRemoveComponent;
  }, [shouldRemoveComponent]);

  useEffect(() => {

    addComponent(panelId, (
      <Panel panelId={panelId} width="auto" height="auto" bgcolor="globalColor6" connectedHref="/about">
        <TitleBar title="about" />
        <h2>About Page Panel</h2>
        <p>This panel appears when visiting About!</p>
        <TitleBar title="⋆⋅☆⋅⋆" />
      </Panel>
    ));

    return () => {
      if (shouldRemoveComponentRef.current) {
        removeComponent(panelId);
      } else {
      }
    };
  }, []); 

  return <p>This is the About Page!</p>;
}
