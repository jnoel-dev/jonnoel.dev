import anime from "animejs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./panel.module.css";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";
import { useRouter } from "next/router";
import { useGlobalComponents } from "../globalComponentsContext/globalComponentsContext";

let isFirstRenderAfterRefresh = true; // Global flag

if (typeof window !== "undefined" && performance.getEntriesByType("navigation")[0]?.type === "reload") {
  isFirstRenderAfterRefresh = true; // Reset on page refresh
}

export default function Panel({ height, width, children, bgcolor="globalColor1", connectedHref, panelId}) {
  
  const panelRef = useRef(null);
  const dragZoneRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isScalingAnimationComplete, setIsScalingAnimationComplete] = useState(false);
  const isClippingAnimationCompleteRef = useRef(false);
  const hasRendered = useRef(false);
  const animationRef = useRef(null);
  const fullConfig = resolveConfig(tailwindConfig);
  const bgColorValue = fullConfig.theme.colors[bgcolor];
  const hasStarted = useRef(false);
  const router = useRouter();
  const { removeComponent, setShouldRemoveComponent} = useGlobalComponents();
  const panelResetTimeout = 5000;

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (!isPageLoaded) {
      setIsPageLoaded(true);
    }
  }, []);

  const adjustedOpeningDelay = isFirstRenderAfterRefresh ? 2000 : 100;

  useEffect(() => {
    if (isPageLoaded) {
      isFirstRenderAfterRefresh = false; // Only turn off after full page load
    }
  }, [isPageLoaded]);

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
        hasRendered.current = true;
      });
    };
    
    if (!hasRendered.current){
      calculateSize();
    }
    

    return;
  }, [width, height, children]);

  const mousePositionRef = useRef({ x: 0, y: 0 });

useEffect(() => {
  const updateMousePosition = (e) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  window.addEventListener("mousemove", updateMousePosition);
 

  return () => {
    window.removeEventListener("mousemove", updateMousePosition);
  };
}, []);

useEffect(() => {
  if (!panelRef.current) return;
  const handleAnimationComplete = (event) => {
  
    if (panelRef.current == event.detail){
      setIsHovered(true);
      setTimeout(() => {
        forceCheckMouseOver();
      }, panelResetTimeout);
    }

  };

  window.addEventListener("panelForcedCenter", handleAnimationComplete);

  return () => {
    window.removeEventListener("panelForcedCenter", handleAnimationComplete);
  };

}, []);

const forceCheckMouseOver = () => {

    if (!panelRef.current) return;

    // ✅ Get latest mouse position from ref
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    // ✅ Check the element under the mouse
    const hoveredElement = document.elementFromPoint(mouseX, mouseY);

    if (panelRef.current.contains(hoveredElement)) {
   
      handleMouseEnter();
    }
    else{
     
      
      
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
        complete: () => {
          isClippingAnimationCompleteRef.current = true;
       
          setIsHovered(true);

          setTimeout(() => {
            forceCheckMouseOver();
          }, panelResetTimeout);
        }
        ,
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

    if (!isClippingAnimationCompleteRef.current || panelRef.current.dataset.isMovingToCenter === "true") return;

    
    setIsHovered(true);

  };
  

  
  

  const handleMouseLeave = () => {
    if (isDragging) return;

    anime({
      targets: panelRef.current,
      scale: 1.0,
      duration: 50,
      easing: "easeOutQuad",
      complete: () => {
        setIsHovered(false);
      },
    });
  };

  const handleMouseDown = (e) => {
    if (!isClippingAnimationCompleteRef.current && !isScalingAnimationComplete || !dragZoneRef.current.contains(e.target)) return;

    anime.remove(panelRef.current);
    setIsDragging(true);

    const computedStyle = window.getComputedStyle(panelRef.current);
    const left = parseFloat(computedStyle.left || 0);
    const top = parseFloat(computedStyle.top || 0);

    setOffset({ x: e.clientX - left, y: e.clientY - top });
  };
  const handleMouseUpCloseButton = (e) => {

    
    router.back();
    setShouldRemoveComponent(true);
    removeComponent(panelId);
   
    // anime({
    //   targets: panelRef.current,
    //   scale: [1, 1.1, 0], // Quick pop before disappearing
    //   opacity: [1, 0],
    //   duration: 1000,
    //   easing: "easeInOutQuad",
    //   complete: () => {

    //   },
    // });
    

  };
  
  const handleMouseEnterCloseButton = (e) => {

    

    anime({
      targets: closeButtonRef.current,
      scale: 1.5,
      duration: 100,
      easing: "easeOutQuad",
    });

  };

  const handleMouseLeaveCloseButton = (e) => {

    anime({
      targets: closeButtonRef.current,
      scale: 1,
      duration: 100,
      easing: "easeOutQuad",
    });

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
      const animateFloating = () => {
        if (!panelRef.current) return;
  
        const panel = panelRef.current;
        const rect = panel.getBoundingClientRect();
  
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
  
        const newX = Math.max(0, Math.min(maxX, rect.left + (Math.random() * 60 - 30)));
        const newY = Math.max(0, Math.min(maxY, rect.top + (Math.random() * 60 - 30)));
  
        const currentRotation = parseFloat(
          panel.style.transform.match(/rotateZ\((-?\d+(?:\.\d+)?)deg\)/)?.[1] || "0"
        );
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
          update: () => {
            if (isHovered || isDragging) {
              animationRef.current.pause(); 
            }
          },
          complete: () => {
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
        complete: () => setIsScalingAnimationComplete(true),
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
          className={`card-content absolute 
            ${width === "auto" ? "w-max" : "w-[calc(100%-8px)]"} 
            ${height === "auto" ? "h-max" : "h-[calc(100%-24px)]"} 
            top-[20px] left-[4px] ${styles.cardContent}`}
            style={{backgroundColor: bgColorValue}}
        >
          {children}
        </div>
      </div>
      <div
        ref={dragZoneRef}
        className={styles.dragZone}
        onMouseDown={handleMouseDown}
      ></div>
      {connectedHref !== "/" && <button
        ref={closeButtonRef}
        className={styles.closeButton}
        onMouseUp={handleMouseUpCloseButton}
        onMouseEnter={handleMouseEnterCloseButton}
        onMouseLeave={handleMouseLeaveCloseButton}
     
      >x</button>}
    </div>
  );
}
