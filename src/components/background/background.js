import styles from './background.module.css';
import Script from 'next/script';

export default function Background() {
  return (
    <div className={styles.color_animation}>
      <canvas className={styles.canvas }>
        <Script src="/js/background_animation.js"> </Script>
      </canvas>
    </div>
  )
}