import React, { useState } from "react";
import styles from "./winButton.module.css"; // Import CSS Module
import { useRouter } from "next/router";
import { useGlobalComponents } from "../globalComponentsContext/globalComponentsContext";
import anime from "animejs";

export default function WinButton({ children, href, onClick, connectedPanelId }) {
  const [isPressed, setIsPressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); 
  const router = useRouter();
  const { getPanelRef } = useGlobalComponents();

  const handleClick = () => {

    
    console.log(isAnimating)
    if (isAnimating || isDisabled) return;
    

    setIsDisabled(true); 
    setTimeout(() => setIsDisabled(false), 1000); 

    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }

    if (connectedPanelId) {
      const panelWrapper = getPanelRef(connectedPanelId);

      if (panelWrapper ) {
        const panel = panelWrapper.firstElementChild; 
    
      
        panel.dataset.isMovingToCenter = "true";
        panel.dataset.isMovingToCenterAnimationCompleted = "false";
        setIsAnimating(true);
    
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const rect = panel.getBoundingClientRect();
    
        anime.remove(panel);
    
        anime({
          targets: panel,
          left: `${(viewportWidth - rect.width) / 2}px`,
          top: `${(viewportHeight - rect.height) / 2}px`,
          easing: "easeOutExpo",
          duration: 1000,
          complete: () => {
            setIsAnimating(false);
            panel.dataset.isMovingToCenter = "false"; 
            const event = new CustomEvent("panelForcedCenter", { detail: panel });
            window.dispatchEvent(event);
     
          },
        });

        //fix later
        setTimeout(() => {
          if (isAnimating) {
            setIsAnimating(false);
            panel.dataset.isMovingToCenter = "false"; 
            const event = new CustomEvent("panelForcedCenter", { detail: panel });
            window.dispatchEvent(event);
          }
        }, 1050); 
      }
    }
    
  };


  return (
    <button
      className={`${styles.winButton} ${isPressed ? styles.pressed : ""}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
