"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { DitherMaterial } from "../../shaders/ditherShader";
import { extend } from "@react-three/fiber";
import tailwindConfig from "../../../tailwind.config";

extend({ DitherMaterial });

function FullscreenPlane() {
  const ref = useRef();
  const { viewport, size } = useThree();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const updateMousePosition = (event) => {
      const aspectRatio = size.width / size.height;

      const x = event.clientX / size.width;
      const y = 1.0 - event.clientY / size.height;

      const correctedX = x * aspectRatio;

      setMousePos({ x: correctedX, y });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [size]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value = clock.getElapsedTime() * 0.25;
      ref.current.material.uniforms.resolution.value.set(
        size.width,
        size.height,
      );

      ref.current.material.uniforms.mousePosition.value.set(
        mousePos.x,
        mousePos.y,
      );

      ref.current.material.uniforms.globalColor1.value.set(
        tailwindConfig.theme.colors.globalColor1,
      );
      ref.current.material.uniforms.globalColor2.value.set(
        tailwindConfig.theme.colors.globalColor2,
      );
      ref.current.material.uniforms.globalColor3.value.set(
        tailwindConfig.theme.colors.globalColor3,
      );
      ref.current.material.uniforms.globalColor4.value.set(
        tailwindConfig.theme.colors.globalColor4,
      );
      ref.current.material.uniforms.globalColor5.value.set(
        tailwindConfig.theme.colors.globalColor5,
      );
      ref.current.material.uniforms.globalColor6.value.set(
        tailwindConfig.theme.colors.globalColor6,
      );
    }
  });

  return (
    <mesh ref={ref} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <ditherMaterial />
    </mesh>
  );
}

export default function DitheredBackground() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 100, position: [0, 0, 1] }}
      style={{ position: "absolute", width: "100vw", height: "100vh" }}
    >
      <FullscreenPlane />
    </Canvas>
  );
}
