import { createContext, useContext, useState } from "react";

const GlobalComponentsContext = createContext();

export function GlobalComponentsProvider({ children }) {
  const [components, setComponents] = useState([]);
  const [componentIds, setComponentIds] = useState(new Set()); // 🔹 Track added components

  const addComponent = (id, component) => {
    if (componentIds.has(id)) return; // 🔹 Prevent duplicates

    setComponents((prev) => [...prev, { id, component }]);
    setComponentIds((prev) => new Set(prev).add(id));
  };

  const removeComponent = (id) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    setComponentIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <GlobalComponentsContext.Provider value={{ addComponent, removeComponent }}>
      {children}
      {components.map(({ id, component }) => (
        <div key={id}>{component}</div>
      ))}
    </GlobalComponentsContext.Provider>
  );
}

export function useGlobalComponents() {
  return useContext(GlobalComponentsContext);
}
