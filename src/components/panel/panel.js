import anime from "animejs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./panel.module.css";

export default function Panel({ height, width, children }) {
  const panelRef = useRef(null);
  const dragZoneRef = useRef(null);
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const calculateSize = () => {
      requestAnimationFrame(() => {
        if (panelRef.current) {
          let maxWidth = width;
          let maxHeight = height;

          const contentRect = panelRef.current.querySelector(`.${styles.cardContent}`)?.getBoundingClientRect();
          if (contentRect) {
            maxWidth = width === "auto" ? contentRect.width + 8 : width;
            maxHeight = height === "auto" ? contentRect.height + 24 : height;
          }

          setSize({ width: maxWidth, height: maxHeight });
        }
      });
    };

    calculateSize();
    window.addEventListener("resize", calculateSize);

    return () => window.removeEventListener("resize", calculateSize);
  }, [width, height, children]);

  useEffect(() => {
    if (panelRef.current) {
      anime({
        targets: panelRef.current,
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
        easing: "easeOutExpo",
        duration: 800,
        delay: 1000,
      });

      const centerPanel = () => {
        requestAnimationFrame(() => {
          if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) { // Ensure panel is fully rendered
              const centerX = (window.innerWidth - rect.width) / 2;
              const centerY = (window.innerHeight - rect.height) / 2;
              panelRef.current.style.left = `${centerX}px`;
              panelRef.current.style.top = `${centerY}px`;
            }
          }
        });
      };

      setTimeout(centerPanel, 50); // Small delay ensures panel is fully rendered

      window.addEventListener("resize", centerPanel);
      return () => window.removeEventListener("resize", centerPanel);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      panelRef.current.style.left = `${e.clientX - offset.x}px`;
      panelRef.current.style.top = `${e.clientY - offset.y}px`;
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (e) => {
    // Only allow dragging if clicked inside the top 20px
    if (!dragZoneRef.current.contains(e.target)) return;

    anime.remove(panelRef.current); // Stop hover animation immediately
    setIsDragging(true);

    const rect = panelRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (!isDragging) {
      anime({ targets: panelRef.current, scale: 1.05, duration: 50, easing: "easeOutQuad" });
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      anime({ targets: panelRef.current, scale: 1, duration: 50, easing: "easeOutQuad" });
    }
  };

  const maxSize = Math.max(size.height, size.width);

  return (
    <div
      className={styles.panel}
      ref={panelRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Drag Zone - Only This Area is Clickable for Dragging */}
      

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
          {children}
        </div>
      </div>
      <div ref={dragZoneRef} className={styles.dragZone}></div>
    </div>
  );
}
