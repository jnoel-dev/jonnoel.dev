/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

interface GifCardProps {
  gifUrl: string;
  alt?: string;
  scale?: number;
}

function useImageDimensions(imgRef: React.RefObject<HTMLImageElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    function handleLoad() {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    }

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

export default function GifCard({  gifUrl, alt = "GIF Card", scale = 1.0  }: GifCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null!);
  const { width } = useImageDimensions(imgRef);

  useEffect(() => {
    if (imgRef.current && width > 0) {
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

    const maxRotate = 10; 
    const rotateX = -((deltaY / centerY) * maxRotate);
    const rotateY = (deltaX / centerX) * maxRotate;

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
      scale: 1,
      duration: 200,
      easing: "easeOutQuad",
    });
  };

  return (
    <div
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
        {}
        <img ref={imgRef} src={gifUrl} alt={alt} style={{ display: "block" }} />
      </div>
    </div>
  );
};


