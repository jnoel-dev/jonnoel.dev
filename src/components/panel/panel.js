import anime from "animejs";
import { useEffect, useRef, useState } from "react";
import styles from "./panel.module.css";

export default function Panel({ height, width }) {
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const maxSize = Math.max(height, width);
  console.log(maxSize);

  const centerPanel = () => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2 - rect.width / 2;
      const centerY = window.innerHeight / 2 - rect.height / 2;

      panelRef.current.style.left = `${centerX}px`;
      panelRef.current.style.top = `${centerY}px`;
    }
  };

  useEffect(() => {
    if (panelRef.current) {
      anime({
        targets: panelRef.current,
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
        easing: "easeOutExpo",
        duration: 800,
        delay: 2000,
      });

      centerPanel();
      window.addEventListener("resize", centerPanel);

      return () => {
        window.removeEventListener("resize", centerPanel);
      };
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      panelRef.current.style.left = `${e.clientX - offset.x}px`;
      panelRef.current.style.top = `${e.clientY - offset.y}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    anime({
      targets: panelRef.current,
      scale: 1.05,

      duration: 100,
      easing: "easeOutQuad",
    });
  };

  const handleMouseLeave = () => {
    anime({
      targets: panelRef.current,
      scale: 1,

      duration: 100,
      easing: "easeOutQuad",
    });
  };

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
        className={`card-wrapper bg-globalColor6 relative overflow-hidden before:absolute before:content-['']  before:animate-border-spin`}
        style={{
          height: `${height}px`,
          width: `${width}px`,
          "--before-width": `${maxSize}px`,
          "--before-height": `${maxSize}px`,
          "--before-left": `${(width - maxSize) / 2}px`,
          "--before-top": `${(height - maxSize) / 2}px`,
        }}
      >
        <div
          className="card-content absolute bg-globalColor1 w-[calc(100%-16px)] h-[calc(100%-16px)] top-[8px] left-[8px]"
          style={{
            justifyContent: "center",
            textAlign: "center",
            display: "flex",
          }}
        >
          :3
        </div>
      </div>
    </div>
  );
}
