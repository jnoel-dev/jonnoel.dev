import React, { useState } from "react";
import styles from "./winButton.module.css"; // Import CSS Module

export default function WinButton({ children, onClick }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={`${styles.winButton} ${isPressed ? styles.pressed : ""}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
