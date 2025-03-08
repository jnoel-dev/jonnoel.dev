'use client'

import React, { useEffect, useRef } from "react";
import { useGlobalComponents } from "../../components/globalComponentsContext/GlobalComponentsContext";
import AboutPanel from "../../components/pagePanels/AboutPanel";

export default function AboutPage() {
  const { addComponent, removeComponent, shouldRemoveComponent } = useGlobalComponents();
  const panelId: string = "about";
  const shouldRemoveComponentRef = useRef<boolean>(shouldRemoveComponent);


  useEffect(() => {
    shouldRemoveComponentRef.current = shouldRemoveComponent;
  }, [shouldRemoveComponent]);

  useEffect(() => {

    addComponent(
      panelId,
      <AboutPanel panelId={panelId} />
    );

    return () => {
      if (shouldRemoveComponentRef.current) {
        removeComponent(panelId);
      }
    };
  }, []);

  return;
};


