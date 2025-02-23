import React, { useState } from "react";
import styles from "./winButton.module.css"; // Import CSS Module
import { useRouter } from "next/router";

export default function WinButton({ children, href, onClick }) {
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };


  return (
    <button
      className={`${styles.winButton} ${isPressed ? styles.pressed : ""}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
