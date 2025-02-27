import anime from "animejs";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./panel.module.css";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";
import { useRouter } from "next/router";
import { useGlobalComponents } from "../globalComponentsContext/globalComponentsContext";

let isFirstRenderAfterRefresh = true;
if (typeof window !== "undefined") {
  const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  if (navEntry?.type === "reload") {
    isFirstRenderAfterRefresh = true;
  }
}

interface PanelProps {
  height: number | "auto";
  width: number | "auto";
  children: React.ReactNode;
  bgcolor?: string;
  connectedHref: string;
  panelId: string;
}

interface TailwindConfig {
  theme: {
    colors: Record<string, string>;
  };
}

interface GlobalComponentsContextType {
  removeComponent: (panelId: string) => void;
  setShouldRemoveComponent: (value: boolean) => void;
}

const Panel: React.FC<PanelProps> = ({
  height,
  width,
  children,
  bgcolor = "globalColor1",
  connectedHref,
  panelId,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragZoneRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: typeof width === "number" ? width : 0,
    height: typeof height === "number" ? height : 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isScalingAnimationComplete, setIsScalingAnimationComplete] = useState<boolean>(false);
  const isClippingAnimationCompleteRef = useRef<boolean>(false);
  const animationRef = useRef<ReturnType<typeof anime> | null>(null);
  const fullConfig = resolveConfig(tailwindConfig) as TailwindConfig;
  const bgColorValue = fullConfig.theme.colors[bgcolor];
  const hasStarted = useRef<boolean>(false);
  const router = useRouter();
  const { removeComponent, setShouldRemoveComponent } = useGlobalComponents() as GlobalComponentsContextType;
  const panelResetTimeout = 5000;
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!isPageLoaded) {
      setIsPageLoaded(true);
    }
  }, [isPageLoaded]);

  const adjustedOpeningDelay = isFirstRenderAfterRefresh ? 2000 : 100;

  useEffect(() => {
    if (isPageLoaded) {
      isFirstRenderAfterRefresh = false;
    }
  }, [isPageLoaded]);

  useLayoutEffect(() => {
    const calculateSize = (): void => {
      requestAnimationFrame((): void => {
        if (panelRef.current) {
          let maxWidth: number = typeof width === "number" ? width : 0;
          let maxHeight: number = typeof height === "number" ? height : 0;
          const contentElement = panelRef.current.querySelector(`.${styles.cardContent}`) as HTMLElement | null;
          if (contentElement) {
            const contentRect = contentElement.getBoundingClientRect();
            if (width === "auto") {
              maxWidth = contentRect.width + 8;
            }
            if (height === "auto") {
              maxHeight = contentRect.height + 24;
            }
          }
          setSize({ width: maxWidth, height: maxHeight });
        }
      });
    };

    // Calculate size initially
    calculateSize();

    // Use ResizeObserver to recalculate when content changes
    const contentElement = panelRef.current?.querySelector(`.${styles.cardContent}`) as HTMLElement | null;
    let observer: ResizeObserver | null = null;
    if (contentElement) {
      observer = new ResizeObserver(() => {
        calculateSize();
      });
      observer.observe(contentElement);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [width, height]);

  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent): void => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;
    const handleAnimationComplete = (event: CustomEvent): void => {
      if (panelRef.current === event.detail) {
        setIsHovered(true);
        setTimeout((): void => {
          forceCheckMouseOver();
        }, panelResetTimeout);
      }
    };
    window.addEventListener("panelForcedCenter", handleAnimationComplete as EventListener);
    return () => {
      window.removeEventListener("panelForcedCenter", handleAnimationComplete as EventListener);
    };
  }, []);

  const forceCheckMouseOver = (): void => {
    if (!panelRef.current) return;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;
    const hoveredElement = document.elementFromPoint(mouseX, mouseY);
    if (hoveredElement && panelRef.current.contains(hoveredElement)) {
      handleMouseEnter();
    } else {
      handleMouseLeave();
    }
  };

  useEffect(() => {
    if (panelRef.current) {
      isClippingAnimationCompleteRef.current = false;
      const animation = anime({
        targets: panelRef.current,
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
        easing: "easeOutExpo",
        duration: 800,
        delay: adjustedOpeningDelay,
        complete: (): void => {
          isClippingAnimationCompleteRef.current = true;
          setIsHovered(true);
          setTimeout((): void => {
            forceCheckMouseOver();
          }, panelResetTimeout);
        }
      });
      const centerPanel = (): void => {
        requestAnimationFrame((): void => {
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

  const handleMouseEnter = (): void => {
    if (!isClippingAnimationCompleteRef.current || panelRef.current?.dataset.isMovingToCenter === "true")
      return;
    setIsHovered(true);
  };

  const handleMouseLeave = (): void => {
    if (isDragging) return;
    anime({
      targets: panelRef.current,
      scale: 1.0,
      duration: 50,
      easing: "easeOutQuad",
      complete: (): void => {
        setIsHovered(false);
      }
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (
      !isClippingAnimationCompleteRef.current ||
      !isScalingAnimationComplete ||
      !dragZoneRef.current?.contains(e.target as Node) ||
      panelRef.current?.dataset.isMovingToCenter === "true"
    )
      return;
    anime.remove(panelRef.current);
    setIsDragging(true);
    const computedStyle = window.getComputedStyle(panelRef.current as Element);
    const left = parseFloat(computedStyle.left || "0");
    const top = parseFloat(computedStyle.top || "0");
    setOffset({ x: e.clientX - left, y: e.clientY - top });
  };

  const handleMouseUpCloseButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    router.back();
    setShouldRemoveComponent(true);
    removeComponent(panelId);
  };

  const handleMouseEnterCloseButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    anime({
      targets: closeButtonRef.current,
      scale: 1.5,
      duration: 100,
      easing: "easeOutQuad"
    });
  };

  const handleMouseLeaveCloseButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    anime({
      targets: closeButtonRef.current,
      scale: 1,
      duration: 100,
      easing: "easeOutQuad"
    });
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent): void => {
        if (!panelRef.current) return;
        const panel = panelRef.current;
        const rect = panel.getBoundingClientRect();
        const newX = Math.min(window.innerWidth - rect.width, Math.max(0, e.clientX - offset.x));
        const newY = Math.min(window.innerHeight - rect.height, Math.max(0, e.clientY - offset.y));
        panel.style.left = `${newX}px`;
        panel.style.top = `${newY}px`;
      };
      const handleMouseUp = (): void => {
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
      const animateFloating = (): void => {
        if (!panelRef.current) return;
        const panel = panelRef.current;
        const rect = panel.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        const newX = Math.max(0, Math.min(maxX, rect.left + (Math.random() * 60 - 30)));
        const newY = Math.max(0, Math.min(maxY, rect.top + (Math.random() * 60 - 30)));
        const currentRotationMatch = panel.style.transform.match(/rotateZ\((-?\d+(?:\.\d+)?)deg\)/);
        const currentRotation = parseFloat(currentRotationMatch ? currentRotationMatch[1] : "0");
        const newRotation = Math.max(-15, Math.min(15, currentRotation + (Math.random() * 6 - 3)));
        if (animationRef.current) {
          animationRef.current.pause();
        }
        animationRef.current = anime({
          targets: panel,
          translateX: newX - rect.left,
          translateY: newY - rect.top,
          rotateZ: newRotation,
          easing: "linear",
          duration: Math.random() * 2000 + 4000,
          delay: hasStarted.current ? 0 : 5000,
          loop: false,
          update: (): void => {
            if (isHovered || isDragging) {
              animationRef.current?.pause();
            }
          },
          complete: (): void => {
            hasStarted.current = true;
            if (!isHovered && !isDragging) {
              animateFloating();
            }
          }
        });
      };
      animateFloating();
      return () => {
        if (animationRef.current) {
          animationRef.current.pause();
        }
      };
    }
  }, [isHovered, isDragging]);

  useEffect(() => {
    if (isHovered) {
      hasStarted.current = false;
      anime.remove(panelRef.current);
      anime({
        targets: panelRef.current,
        rotateZ: 0,
        scale: 1.05,
        duration: 100,
        easing: "easeOutQuad",
        complete: (): void => setIsScalingAnimationComplete(true)
      });
    }
  }, [isHovered]);

  const maxSize: number = Math.max(size.height, size.width);

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
          height: height === "auto" ? `${size.height}px` : `${height}px`,
          width: width === "auto" ? `${size.width}px` : `${width}px`,
          "--before-width": `${maxSize}px`,
          "--before-height": `${maxSize}px`,
          "--before-left": `${(size.width - maxSize) / 2}px`,
          "--before-top": `${(size.height - maxSize) / 2}px`
        } as React.CSSProperties}
        
      >
        <div
          className={`card-content absolute ${height === "auto" ? "h-max" : "h-[calc(100%-24px)]"} ${width === "auto" ? "w-max" : "w-[calc(100%-8px)]"} top-[20px] left-[4px] ${styles.cardContent}`}
          style={{ backgroundColor: bgColorValue } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
      <div ref={dragZoneRef} className={styles.dragZone} onMouseDown={handleMouseDown} />
      {connectedHref !== "/" && (
        <button
          ref={closeButtonRef}
          className={styles.closeButton}
          onMouseUp={handleMouseUpCloseButton}
          onMouseEnter={handleMouseEnterCloseButton}
          onMouseLeave={handleMouseLeaveCloseButton}
        >
          x
        </button>
      )}
    </div>
  );
};

export default Panel;
