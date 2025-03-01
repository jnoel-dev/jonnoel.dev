import anime from "animejs";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./panel.module.css";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";
import { useRouter } from "next/router";
import { useGlobalComponents } from "../globalComponentsContext/globalComponentsContext";

const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);
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
  const [transformOffset, setTransformOffset] = useState({ x: 0, y: 0 });
  const [globalViewport, setGlobalViewport] = useState<{ width: number; height: number } | null>(null);


  


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

    calculateSize();

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

  const centerPanel = (viewportWidth: number, viewportHeight: number) => {
    if (!panelRef.current) return;
  
    let rect = panelRef.current.getBoundingClientRect();
    console.log(`Panel ${panelId} rect before centering:`, rect);
  
    if (rect.width === 0 || rect.height === 0) {
      setTimeout(() => centerPanel(viewportWidth, viewportHeight), 50);
      return;
    }
  
    let left = (viewportWidth - rect.width) / 2;
    let top = (viewportHeight - rect.height) / 2;
  
    console.log(`Panel ${panelId} setting left: ${left}, top: ${top}`);
  
    panelRef.current.style.left = `${left}px`;
    panelRef.current.style.top = `${top}px`;
  };
  
  
  // Run centering on mount
  useLayoutEffect(() => {
    if (!panelRef.current) return;
  
    // Only measure viewport once for all panels
    if (!globalViewport) {
      setGlobalViewport({ width: window.innerWidth, height: window.innerHeight });
    }
  
    isClippingAnimationCompleteRef.current = false;
  
    // 🔥 Delay to ensure layout has stabilized before centering all panels
    centerPanel(globalViewport?.width ?? window.innerWidth, globalViewport?.height ?? window.innerHeight);
    // setTimeout(() => {
    //   console.log(`Panel ${panelId} executing centerPanel() with shared viewport`);
    //   centerPanel(globalViewport?.width ?? window.innerWidth, globalViewport?.height ?? window.innerHeight);
    // }, 200);
  
    window.addEventListener("resize", () => centerPanel(window.innerWidth, window.innerHeight));
  
    return () => {
      window.removeEventListener("resize", () => centerPanel(window.innerWidth, window.innerHeight));
    };
  }, [globalViewport]);
  
  
  
  

  
  // 🔥 Move animation logic to `useEffect` so it happens after centering
  useLayoutEffect(() => {
    if (!panelRef.current) return;

    // Run the animation AFTER centering is complete
    const animation = anime({
      targets: panelRef.current,
      clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
      easing: "easeOutExpo",
      duration: 800,
      delay: adjustedOpeningDelay,
      complete: () => {
        isClippingAnimationCompleteRef.current = true;
        setIsHovered(true);
        setTimeout(() => {
          forceCheckMouseOver();
        }, panelResetTimeout);
      }
    });
  
    return () => {
      animation.pause();
    };
  }, []);
  
  
  

  const handleMouseEnter = (): void => {
    if (!isClippingAnimationCompleteRef.current || panelRef.current?.dataset.isMovingToCenter === "true")
      return;
    setIsHovered(true);
  };

  const handleMouseLeave = (): void => {
    if (panelRef.current && !isDragging && !isMobile) {
      anime({
        targets: panelRef.current,
        scale: 1.0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        duration: 200,
        easing: "easeOutQuad",
        complete: () => {
          setIsHovered(false);
        }
      });
    }
  };
  
  const updateOffset = (clientX: number, clientY: number) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
  };
  

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (
      !isClippingAnimationCompleteRef.current ||
      !isScalingAnimationComplete ||
      !dragZoneRef.current?.contains(e.target as Node) ||
      panelRef.current?.dataset.isMovingToCenter === "true"
    ) return;
  
    setIsDragging(true);
  
    if (!panelRef.current) return;
  
    const panel = panelRef.current;
    const rect = panel.getBoundingClientRect();

  
    // 🔥 Define the scale factor (from your animation)
    const scale = 1.05; // Fixed scale value from your animation
  
    // 🔥 Adjust left and top based on scale
    // The panel's size is scaled up, so its width/height is larger than expected
    const widthOffset = (rect.width * scale - rect.width) / 2;
    const heightOffset = (rect.height * scale - rect.height) / 2;
  
    const newLeft = rect.left + widthOffset + transformOffset.x;
    const newTop = rect.top + heightOffset + transformOffset.y;
  
    // 🔥 Apply corrected position
    panel.style.left = `${newLeft}px`;
    panel.style.top = `${newTop}px`;
  
    // 🔥 Preserve scale while resetting translation
    panel.style.transform = `scale(${scale})`;
  
    // Update offset for dragging
    setOffset({ x: e.clientX - newLeft, y: e.clientY - newTop });
  
    // Reset transformOffset since we applied it to left/top
    setTransformOffset({ x: 0, y: 0 });
  };
  
  

  
  

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (
      !isClippingAnimationCompleteRef.current ||
      !isScalingAnimationComplete ||
      !dragZoneRef.current?.contains(e.target as Node) ||
      panelRef.current?.dataset.isMovingToCenter === "true"
    )
      return;
    setIsDragging(true);
    const touch = e.touches[0];
    if (!panelRef.current) return;
    
    anime.remove(panelRef.current);
    updateOffset(touch.clientX, touch.clientY);
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
  function updatePanelPosition(
    panel: HTMLDivElement, 
    x: number, 
    y: number, 
    offset: { x: number; y: number }
  ): void {
    const rect = panel.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(panel);
  
    // 🔥 Extract the scale factor (same as handleMouseDown)
    const scale = 1.05; // Fixed scale value
  
    // 🔥 Compute the scaled offset
    const widthOffset = (rect.width * scale - rect.width) / 2;
    const heightOffset = (rect.height * scale - rect.height) / 2;
  
    // 🔥 Compute viewport boundaries (FINAL FIX!)
    const minX = 0 + widthOffset;  // Left boundary (correct)
    const maxX = window.innerWidth - rect.width + widthOffset; // Right boundary (FIXED)
    const minY = 0 + heightOffset; // Top boundary (correct)
    const maxY = window.innerHeight - rect.height + heightOffset; // Bottom boundary (FIXED)
  
    // 🔥 Restrict new position within the corrected viewport limits
    const newX = Math.min(maxX, Math.max(minX, x - offset.x));
    const newY = Math.min(maxY, Math.max(minY, y - offset.y));
  
    // 🔥 Apply the corrected position
    panel.style.left = `${newX}px`;
    panel.style.top = `${newY}px`;
  }
  
  
  
  

  useEffect(() => {
    if (isDragging && panelRef.current) {
      const panel = panelRef.current;
  
      const handleMouseMove = (e: MouseEvent): void => {
        updatePanelPosition(panel, e.clientX, e.clientY, offset);
      };
  
      const handleMouseUp = (): void => {
        setIsDragging(false);
      };
  
      const handleTouchMove = (e: TouchEvent): void => {
        e.preventDefault();
        const touch = e.touches[0];
        updatePanelPosition(panel, touch.clientX, touch.clientY, offset);
      };
  
      const handleTouchEnd = (): void => {
        setIsDragging(false);
      };
  
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: false });
  
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, offset]);
  
  useEffect(() => {
    if (!isHovered && !isDragging && isClippingAnimationCompleteRef.current) {
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
          easing: "easeInOutQuad",
          duration: Math.random() * 2000 + 4000,
          delay: hasStarted.current ? 0 : 5000,
          loop: false,
          update: () => {
            if (isHovered || isDragging) {
              animationRef.current?.pause();
            }
          },
          complete: () => {
            // Store the last transform values for accurate drag calculations
            setTransformOffset({ x: newX - rect.left, y: newY - rect.top });
  
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
        complete: (): void => {
          setIsScalingAnimationComplete(true);
        }
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
        <div
          ref={dragZoneRef}
          className={styles.dragZone}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ touchAction: "none" }}  
        />

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
