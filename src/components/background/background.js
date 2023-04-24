import styles from './background.module.css';
import Script from 'next/script';

export default function Background() {

  return (
    <div className={styles.color_animation}>
      
      <canvas id="canvas" className={styles.canvas}></canvas>

        <Script strategy="beforeInteractive" src="/scripts/fabric.min.js"></Script>
        
        <Script src="/scripts/background_animation.js"> </Script>

    </div>
  )
}