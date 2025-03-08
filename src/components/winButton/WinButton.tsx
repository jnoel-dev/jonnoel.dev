'use client'
import React, { useState } from "react";
import styles from "./winButton.module.css";
import { useRouter } from "next/navigation";
import { useGlobalComponents } from "../globalComponentsContext/GlobalComponentsContext";
import anime from "animejs";

interface WinButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  connectedPanelId?: string;
}

export default function WinButton({ children, href, onClick, connectedPanelId  }: WinButtonProps) {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const router = useRouter();
  const { getPanelRef } = useGlobalComponents();

  const handleClick = (): void => {
    if (isAnimating || isDisabled) return;
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 1000);
    if (onClick) {
      onClick();
    } else if (href) {
      console.log("pushing")
      router.push(href);
    }
    if (connectedPanelId) {
      const panelWrapper = getPanelRef(connectedPanelId);
      if (panelWrapper) {
        const panel = panelWrapper.firstElementChild as HTMLElement | null;
        if (panel) {
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

        }
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
};


