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
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useLayoutEffect(() => {
    const calculateSize = () => {
      requestAnimationFrame(() => {
        if (panelRef.current) {
          let maxWidth = width;
          let maxHeight = height;

          const contentRect = panelRef.current
            .querySelector(`.${styles.cardContent}`)
            ?.getBoundingClientRect();
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
      setIsAnimationComplete(false);

      const animation = anime({
        targets: panelRef.current,
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
        easing: "easeOutExpo",
        duration: 800,
        delay: 1000,
        complete: () => {
          setIsAnimationComplete(true);
        },
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
      return () => {
        animation.pause();
        window.removeEventListener("resize", centerPanel);
      };
    }
  }, []);

  const handleMouseEnter = () => {
    if (!isAnimationComplete) return;

    setIsHovered(true);
    anime({
      targets: panelRef.current,
      scale: 1.05,
      duration: 100,
      easing: "easeOutQuad",
    });
  };

  const handleMouseLeave = () => {
    if (isDragging) return;

    anime({
      targets: panelRef.current,
      scale: 1.0,
      duration: 100,
      easing: "easeOutQuad",
      complete: () => {
        setIsHovered(false);
      },
    });
  };

  const handleMouseDown = (e) => {
    if (!isAnimationComplete || !dragZoneRef.current.contains(e.target)) return;

    anime.remove(panelRef.current);
    setIsDragging(true);

    const computedStyle = window.getComputedStyle(panelRef.current);
    const left = parseFloat(computedStyle.left || 0);
    const top = parseFloat(computedStyle.top || 0);

    setOffset({ x: e.clientX - left, y: e.clientY - top });
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        if (!panelRef.current) return;
      
        const panel = panelRef.current;
        const rect = panel.getBoundingClientRect();
      
        const newX = Math.min(
          window.innerWidth - rect.width,
          Math.max(0, e.clientX - offset.x)
        );
        const newY = Math.min(
          window.innerHeight - rect.height,
          Math.max(0, e.clientY - offset.y)
        );
      
        panel.style.left = `${newX}px`;
        panel.style.top = `${newY}px`;
      };
      

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, offset]);

  useEffect(() => {
    if (!isHovered && !isDragging) {
      console.log("overriding scale with transform");

      const animateFloating = () => {
        if (!panelRef.current) return;
      
        const panel = panelRef.current;
        const rect = panel.getBoundingClientRect();
      
        const currentX = rect.left;
        const currentY = rect.top;
      
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
      
        const newX = Math.max(0, Math.min(maxX, currentX + (Math.random() * 60 - 30)));
        const newY = Math.max(0, Math.min(maxY, currentY + (Math.random() * 60 - 30)));
      
        const currentRotation = parseFloat(
          panel.style.transform.match(/rotateZ\((-?\d+(?:\.\d+)?)deg\)/)?.[1] || "0"
        );
        const newRotation = Math.max(-15, Math.min(15, currentRotation + (Math.random() * 6 - 3)));
      
        anime({
          targets: panel,
          translateX: newX - rect.left,
          translateY: newY - rect.top,
          rotateZ: newRotation,
          easing: "easeInOutQuad",
          duration: Math.random() * 3000 + 3000,
          loop: false,
          delay: 3000,
          complete: animateFloating,
        });
      };
      

      animateFloating();

      return () => anime.remove(panelRef.current);
    }
  }, [isHovered, isDragging]);

  useEffect(() => {
    if (isHovered) {
      anime.remove(panelRef.current);
      anime({
        targets: panelRef.current,
        rotateZ: 0,
        scale: 1.05,
        duration: 100,
        easing: "easeOutQuad",
        complete: () => setIsAnimationComplete(true),
      });
    }
  }, [isHovered]);

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
      <div
        ref={dragZoneRef}
        className={styles.dragZone}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
}
