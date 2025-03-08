'use client'

import React, { createContext, useContext, useState, useRef } from "react";

interface GlobalComponentEntry {
  id: string;
  component: React.ReactNode;
}

interface GlobalComponentsContextType {
  addComponent: (id: string, component: React.ReactNode) => void;
  removeComponent: (id: string) => void;
  getPanelRef: (id: string) => HTMLDivElement | null;
  shouldRemoveComponent: boolean;
  setShouldRemoveComponent: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalComponentsContext = createContext<GlobalComponentsContextType | undefined>(undefined);

interface GlobalComponentsProviderProps {
  children?: React.ReactNode;
}

export function GlobalComponentsProvider({ children }: GlobalComponentsProviderProps): React.JSX.Element {
  const [components, setComponents] = useState<GlobalComponentEntry[]>([]);
  const panelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [shouldRemoveComponent, setShouldRemoveComponent] = useState<boolean>(false);

  const addComponent = (id: string, component: React.ReactNode): void => {
    setComponents((prev) => {
      // ✅ Prevent duplicate entries by checking if ID already exists in state
      if (prev.some((c) => c.id === id)) return prev;

      return [
        ...prev,
        {
          id,
          component: (
            <div key={id} ref={(el) => { if (el) panelRefs.current.set(id, el); }}>
              {component}
            </div>
          ),
        },
      ];
    });
  };

  const removeComponent = (id: string): void => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    panelRefs.current.delete(id);
  };

  const getPanelRef = (id: string): HTMLDivElement | null => panelRefs.current.get(id) || null;

  return (
    <GlobalComponentsContext.Provider
      value={{
        addComponent,
        removeComponent,
        getPanelRef,
        shouldRemoveComponent,
        setShouldRemoveComponent,
      }}
    >
      {children}
      {components.map(({ component }) => component)}
    </GlobalComponentsContext.Provider>
  );
}

export function useGlobalComponents(): GlobalComponentsContextType {
  const context = useContext(GlobalComponentsContext);
  if (!context) {
    throw new Error("useGlobalComponents must be used within a GlobalComponentsProvider");
  }
  return context;
}
