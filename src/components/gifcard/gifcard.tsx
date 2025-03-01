// GifCard.tsx
import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

interface GifCardProps {
  gifUrl: string;
  alt?: string;
  /** The base scale of the image in actual layout (not just transform). Defaults to 1.0. */
  scale?: number;
}

/**
 * A helper hook to get the natural width/height of an <img> once it loads.
 */
function useImageDimensions(imgRef: React.RefObject<HTMLImageElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Handler for when the image finishes loading (or is already loaded).
    function handleLoad() {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    }

    // If it's already loaded, run immediately; otherwise, wait for "load".
    if (img.complete && img.naturalWidth) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => {
        img.removeEventListener("load", handleLoad);
      };
    }
  }, [imgRef]);

  return dimensions;
}

const GifCard: React.FC<GifCardProps> = ({ gifUrl, alt = "GIF Card", scale = 1.0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null!);

  // Get the image's natural size after it loads.
  const { width } = useImageDimensions(imgRef);

  // On first render or when "scale" changes, set the <img> physical width.
  useEffect(() => {
    if (imgRef.current && width > 0) {
      // Physically resize the image so the bounding box is smaller/larger.
      imgRef.current.style.width = `${width * scale}px`;
    }
  }, [scale, width]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;

    const maxRotate = 10; // degrees
    const rotateX = -((deltaY / centerY) * maxRotate);
    const rotateY = (deltaX / centerX) * maxRotate;

    // Slight additional scale on hover (relative to the physically sized image).
    const hoverScale = 1.05;

    anime({
      targets: cardRef.current,
      rotateX,
      rotateY,
      scale: hoverScale,
      duration: 200,
      easing: "easeOutQuad",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    anime({
      targets: cardRef.current,
      rotateX: 0,
      rotateY: 0,
      // Return to scale 1.0 in transform terms (the image is already physically scaled).
      scale: 1,
      duration: 200,
      easing: "easeOutQuad",
    });
  };

  return (
    <div
      // The outer container with perspective, sized to fit its contents
      ref={containerRef}
      style={{
        perspective: "1000px",
        display: "inline-block",
        width: "fit-content",
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          willChange: "transform",
        }}
      >
        {/* We physically scale this image in layout via the effect. */}
        <img ref={imgRef} src={gifUrl} alt={alt} style={{ display: "block" }} />
      </div>
    </div>
  );
};

export default GifCard;
