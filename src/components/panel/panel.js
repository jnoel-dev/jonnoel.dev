import anime from "animejs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./panel.module.css";

export default function Panel({ height, width, children }) {
  const panelRef = useRef(null);
  const dragZoneRef = useRef(null);
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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
            if (rect.width > 0 && rect.height > 0) {
              const centerX = (window.innerWidth - rect.width) / 2;
              const centerY = (window.innerHeight - rect.height) / 2;
              panelRef.current.style.left = `${centerX}px`;
              panelRef.current.style.top = `${centerY}px`;
            }
          }
        });
      };

      setTimeout(centerPanel, 50);

      window.addEventListener("resize", centerPanel);
      return () => window.removeEventListener("resize", centerPanel);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // Move panel instantly with cursor
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      panelRef.current.style.left = `${newX}px`;
      panelRef.current.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      // Reset wobbly effect after dragging stops

    };

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

  useEffect(() => {
    if (!isHovered && !isDragging) {
      console.log("overriding scale with trasform")
      const animateFloating = () => {
        if (!panelRef.current) return;
  
        const panel = panelRef.current;
        const rect = panel.getBoundingClientRect(); // Get the panel’s current position
  
        // Get the panel's current position relative to the viewport
        const currentX = rect.left;
        const currentY = rect.top;
  
        // Generate new values while clamping within limits
        const newX = Math.max(currentX - 120, Math.min(currentX + 120, currentX + (Math.random() * 120)));
        const newY = Math.max(currentY - 120, Math.min(currentY + 120, currentY + (Math.random() * 120)));
  
        // Get the current rotation value
        const currentRotation = parseFloat(panel.style.transform.match(/rotateZ\((-?\d+(?:\.\d+)?)deg\)/)?.[1] || "0");
        const newRotation = Math.max(-15, Math.min(15, currentRotation + (Math.random() * 6 - 3)));
  
        anime({
          targets: panel,
          translateX: newX - rect.left, // Translate relative to its current position
          translateY: newY - rect.top,
          rotateZ: newRotation,
          easing: "easeInOutQuad",
          duration: 3000,
          loop: false,
          complete: animateFloating, // Continue animation
        });
      };
  
      animateFloating();
  
      return () => anime.remove(panelRef.current); // Cleanup on re-renders
    }
  }, [isHovered, isDragging]);
  


  const handleMouseDown = (e) => {
    if (!dragZoneRef.current.contains(e.target)) return;
  
    anime.remove(panelRef.current);
    setIsDragging(true);
  
    const computedStyle = window.getComputedStyle(panelRef.current);
    const left = parseFloat(computedStyle.left || 0);
    const top = parseFloat(computedStyle.top || 0);
  
    setOffset({ x: e.clientX - left, y: e.clientY - top });
  };
  
  
  useEffect(() => {
    if (isHovered) {
      anime.remove(panelRef.current);
      anime({
        targets: panelRef.current,
        rotateZ: 0, // Reset rotation on hover
        scale: 1.05, // Scale up
        duration: 100,
        easing: "easeOutQuad",
      });
    } 
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  
  };

  const handleMouseLeave = () => {
   
    anime.remove(panelRef.current);
    anime({
      targets: panelRef.current,
      rotateZ: 0, // Reset rotation on hover
      scale: 1.0, // Scale up
      duration: 100,
      easing: "easeOutQuad",
      complete: leavingDone
    });
    function leavingDone(){
      setIsHovered(false);
    }
  };

  const maxSize = Math.max(size.height, size.width);
  return (
    <div
      className={styles.panel}
      ref={panelRef}
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
          {children}
        </div>
      </div>
      <div ref={dragZoneRef} className={styles.dragZone} onMouseDown={handleMouseDown}></div>
    </div>
  );
}
