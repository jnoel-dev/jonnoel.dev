import { useEffect } from "react";
import { useGlobalComponents } from "../components/globalComponentsCotext/globalComponentsContext";
import Panel from "../components/panel/panel"
export default function AboutPage() {
    const { addComponent, removeComponent } = useGlobalComponents();
  
    useEffect(() => {
      const panelId = "about-panel"; // 🔹 Unique ID for this panel
      addComponent(panelId, (
        <Panel width="auto" height="auto">
          <h2>About Page Panel</h2>
          <p>This panel appears when visiting About!</p>
        </Panel>
      ));
  
      return; // 🔹 Remove when leaving page
    }, [addComponent, removeComponent]);
  
    return <p>This is the About Page!</p>;
  }
  