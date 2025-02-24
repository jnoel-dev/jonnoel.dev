import { useEffect } from "react";
import { useGlobalComponents } from "../components/globalComponentsContext/globalComponentsContext";
import Panel from "../components/panel/panel"
import TitleBar from "../components/titlebar/titlebar";
export default function AboutPage() {
    const { addComponent, removeComponent } = useGlobalComponents();
  
    useEffect(() => {
      const panelId = "about"; // 🔹 Unique ID for this panel
      addComponent(panelId, (
        <Panel width="auto" height="auto" bgcolor="globalColor6">
            <TitleBar title="a b o u t" />
                <h2>About Page Panel</h2>
                <p>This panel appears when visiting About!</p>
            <TitleBar title="⋆⋅☆⋅⋆" />
        </Panel>
      ));
  
      return; // 🔹 Remove when leaving page
    }, [addComponent, removeComponent]);
  
    return <p>This is the About Page!</p>;
  }
  