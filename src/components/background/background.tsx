'use client'

import React, { useEffect } from "react";
import styles from "./background.module.css";
import DitheredBackground from "./ditheredBackground";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";
import * as fabric from "fabric";
import { Sprite } from "./sprite";

interface BackgroundProps {
  children?: React.ReactNode;
}

const fullConfig = resolveConfig(tailwindConfig) as {
  theme: {
    colors: Record<string, string>;
  };
};

export default function Background({ children }: BackgroundProps) {
  useEffect(() => {
    const STAR_MIN_SCALE = .5;
    const STAR_COUNT = 100;

    const canvas: fabric.Canvas = new fabric.Canvas("canvas", {
      selection: false,
    });
    let scale = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    interface Star {
      x: number;
      y: number;
      z: number;
      fabObj: fabric.Object | null;
      dragEventFiring: boolean;
    }
    const stars: Star[] = [];
    let pointerX = 0;
    let pointerY = 0;

    interface Velocity {
      x: number;
      y: number;
      tx: number;
      ty: number;
      z: number;
    }
    let velocity: Velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0 };

    let touchInput = false;
    let imagesDoneLoading = false;

    const handleMouseMove = (event: MouseEvent): void => {
      touchInput = false;
      movePointer(event.pageX, event.pageY);
    };
    document.addEventListener("mousemove", handleMouseMove);

    const resize = (): void => {
      scale = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.setDimensions({ width, height });
      stars.forEach(placeStar);
    };
    window.addEventListener("resize", resize);

    function createSprite(k: number): (sprite: Sprite) => void {
      return (sprite: Sprite): void => {
        // Configure the sprite's properties.
        sprite.set({
          top: 0,
          left: 0,
          originX: "center",
          originY: "center",
          selectable: true,
          hasControls: false,
          hasBorders: false,
          hoverCursor: "default",
        });
        // Scale the sprite based on its star's random scale.
        sprite.scale(stars[k].z);
        canvas.add(sprite);
        sprite.play();
        stars[k].fabObj = sprite;
    
        // Drag/drop event handling.
        sprite.on("mousedown", () => {
          stars[k].dragEventFiring = true;
        });
        sprite.on("mouseup", () => {
          stars[k].dragEventFiring = false;
          stars[k].x = sprite.left as number;
          stars[k].y = sprite.top as number;
        });
        sprite.on("moving", () => {
          stars[k].x = sprite.left as number;
          stars[k].y = sprite.top as number;
        });
    
        // Animated scaling on mouseover and mouseout.
        sprite.on("mouseover", () => {
          sprite.animate({ scaleX: stars[k].z * 1.5 }, {
            duration: 100,
            onChange: canvas.renderAll.bind(canvas),
          });
          sprite.animate({ scaleY: stars[k].z * 1.5 }, {
            duration: 100,
            onChange: canvas.renderAll.bind(canvas),
          });
        });
        sprite.on("mouseout", () => {
          sprite.animate({ scaleX: stars[k].z }, {
            duration: 100,
            onChange: canvas.renderAll.bind(canvas),
          });
          sprite.animate({ scaleY: stars[k].z }, {
            duration: 100,
            onChange: canvas.renderAll.bind(canvas),
          });
        });
      };
    }
    
    

    function placeStar(star: Star): void {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    }

    function generate(): void {
      for (let k = 0; k < STAR_COUNT; k++) {
        const star: Star = {
          x: 0,
          y: 0,
          z: Math.random() * STAR_MIN_SCALE,
          fabObj: null,
          dragEventFiring: false,
        };
        stars.push(star);
        const starUrl = `/images/star${Math.floor(Math.random() * 4) + 1}.png`;
        Sprite.fromURL(starUrl)
          .then((sprite) => {
            star.fabObj = sprite;
            createSprite(k)(sprite);
          })
          .catch((err) => console.error("Sprite loading error:", err));
      }
    }

    function step(): void {
      if (imagesDoneLoading) {
        update();
      }
      canvas.requestRenderAll();
      fabric.util.requestAnimFrame(step);
    }

    function update(): void {
      velocity.tx *= 0.96;
      velocity.ty *= 0.96;
      velocity.x += (velocity.tx - velocity.x) * 0.8;
      velocity.y += (velocity.ty - velocity.y) * 0.8;
      stars.forEach((star: Star) => {
        if (!star.dragEventFiring && star.fabObj) {
          star.x += velocity.x * star.z;
          star.y += velocity.y * star.z;
          star.x += (star.x - width / 2) * velocity.z * star.z;
          star.y += (star.y - height / 2) * velocity.z * star.z;
          star.fabObj.set({ left: star.x, top: star.y });
          star.fabObj.setCoords();
        }
      });
    }

    function movePointer(x: number, y: number): void {
      if (typeof pointerX === "number" && typeof pointerY === "number") {
        const ox = x - pointerX;
        const oy = y - pointerY;
        velocity.tx += (ox / 8) * scale * (touchInput ? 1 : -1) * 0.01;
        velocity.ty += (oy / 8) * scale * (touchInput ? 1 : -1) * 0.01;
      }
      pointerX = x;
      pointerY = y;
    }

    generate();
    resize();

    imagesDoneLoading = true;
    step();

    const canvasElement = document.getElementById("canvas");
    if (canvasElement) {
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
            }
          : null;
      };

      const colorval = hexToRgb(fullConfig.theme.colors.globalColor1);
      if (colorval) {
        const finalval = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="689d94" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 ${colorval.r} 0 0 0 0 ${colorval.g} 0 0 0 0 ${colorval.b} 0 0 0 1 0"/></filter></defs></svg>#689d94')`;
        canvasElement.style.filter = finalval;
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      canvas.dispose();
    };
    
  }, []);

  return (
    <>
      <div className={styles.background} id="background">
        <DitheredBackground />
        <canvas id="canvas"></canvas>
      </div>
      {children}
    </>
  );
};


