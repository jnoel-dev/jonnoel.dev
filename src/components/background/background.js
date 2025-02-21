import styles from "./background.module.css";
import Script from "next/script";
import DitheredBackground from "../ditheredBackground";

export default function Background(props) {
  return (
    <>
      <div className={styles.background} id="background">
        <DitheredBackground />
        <canvas id="canvas"></canvas>

        <Script
          strategy="beforeInteractive"
          src="/scripts/fabric.min.js"
        ></Script>
        <Script
          strategy="beforeInteractive"
          src="/scripts/sprite.class.js"
        ></Script>
        <Script src="/scripts/background_animation.js"> </Script>
      </div>

      {props.children}
    </>
  );
}
