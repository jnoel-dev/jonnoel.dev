'use client'

import React, { useEffect, useRef } from "react";
import { useGlobalComponents } from "../../components/globalComponentsContext/GlobalComponentsContext";
import AboutPanel from "../../components/pagePanels/AboutPanel";

export default function AboutPage() {
  const { addComponent, removeComponent, shouldRemoveComponent } = useGlobalComponents();
  const panelId: string = "about";
  const shouldRemoveComponentRef = useRef<boolean>(shouldRemoveComponent);
  const removalInitiated = useRef(false);
  const addingInitiated = useRef(false);


  useEffect(() => {
    shouldRemoveComponentRef.current = shouldRemoveComponent;
  }, [shouldRemoveComponent]);

  useEffect(() => {
    if (!addingInitiated.current){
      addingInitiated.current = true;
      addComponent(panelId, <AboutPanel panelId={panelId} />);
    }
    
  
    return () => {
      if (!removalInitiated.current && shouldRemoveComponentRef.current) {
        removalInitiated.current = true;
        addingInitiated.current = false;
        removeComponent(panelId);
      }
    };
  }, [addComponent, removeComponent, panelId]);
  

  return;
};


