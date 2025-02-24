import { createContext, useContext, useState, useRef } from "react";

const GlobalComponentsContext = createContext();

export function GlobalComponentsProvider({ children }) {
  const [components, setComponents] = useState([]); // Stores added components
  const panelRefs = useRef(new Map()); // Stores panel refs by ID

  const addComponent = (id, component) => {
    if (!panelRefs.current.has(id)) {
      setComponents((prev) => [
        ...prev,
        {
          id,
          component: (
            <div key={id} ref={(el) => el && panelRefs.current.set(id, el)}>
              {component}
            </div>
          ),
        },
      ]);
    }
  };

  const removeComponent = (id) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    panelRefs.current.delete(id);
  };

  const getPanelRef = (id) => panelRefs.current.get(id) || null; // Ensures null if not found

  return (
    <GlobalComponentsContext.Provider value={{ addComponent, removeComponent, getPanelRef }}>
      {children}
      {components.map(({ component }) => component)}
    </GlobalComponentsContext.Provider>
  );
}

export function useGlobalComponents() {
  return useContext(GlobalComponentsContext);
}
