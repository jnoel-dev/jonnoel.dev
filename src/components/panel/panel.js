import anime from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "./panel.module.css";
import WinButton from "../winButton/winButton";

export default function Panel({ height, width }) {
  const panelRef = useRef(null);
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const calculateSize = () => {
      requestAnimationFrame(() => {
        if (panelRef.current) {
          let maxWidth = width;
          let maxHeight = height;

          if (width === "auto" || height === "auto") {
            const contentRect = panelRef.current.querySelector(`.${styles.cardContent}`)?.getBoundingClientRect();
            if (contentRect) {
              maxWidth = width === "auto" ? contentRect.width + 8 : width;
              maxHeight = height === "auto" ? contentRect.height + 24 : height;
            }
          }

          setSize({ width: maxWidth, height: maxHeight });
        }
      });
    };

    calculateSize();
    window.addEventListener("resize", calculateSize);

    anime({
      targets: panelRef.current,
      clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
      easing: "easeOutExpo",
      duration: 800,
      delay: 1000,
    });

    const centerPanel = () => {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2 - rect.width / 2;
        const centerY = window.innerHeight / 2 - rect.height / 2;
        panelRef.current.style.left = `${centerX}px`;
        panelRef.current.style.top = `${centerY}px`;
      }
    };

    centerPanel();
    window.addEventListener("resize", centerPanel);

    return () => {
      window.removeEventListener("resize", calculateSize);
      window.removeEventListener("resize", centerPanel);
    };
  }, [width, height]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      panelRef.current.style.left = `${e.clientX - offset.x}px`;
      panelRef.current.style.top = `${e.clientY - offset.y}px`;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseEnter = () => {
    anime({ targets: panelRef.current, scale: 1.05, duration: 50, easing: "easeOutQuad" });
  };

  const handleMouseLeave = () => {
    anime({ targets: panelRef.current, scale: 1, duration: 50, easing: "easeOutQuad" });
  };

  const maxSize = Math.max(size.height, size.width);

  return (
    <div
      className={styles.panel}
      ref={panelRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="card-wrapper bg-globalColor6 relative overflow-hidden before:absolute before:content-[''] before:animate-border-spin"
        style={{
          height: size.height === "auto" ? "max-content" : `${size.height}px`,
          width: size.width === "auto" ? "max-content" : `${size.width}px`,
          "--before-width": `${maxSize}px`,
          "--before-height": `${maxSize}px`,
          "--before-left": `${(size.width - maxSize) / 2}px`,
          "--before-top": `${(size.height - maxSize) / 2}px`,
        }}
      >
        <div
          className={`card-content absolute bg-globalColor1 
            ${width === "auto" ? "w-max" : "w-[calc(100%-8px)]"} 
            ${height === "auto" ? "h-max" : "h-[calc(100%-24px)]"} 
            top-[20px] left-[4px] ${styles.cardContent}`}
        >
          <WinButton>about</WinButton>
          <WinButton>about</WinButton>
        </div>
      </div>
    </div>
  );
}
