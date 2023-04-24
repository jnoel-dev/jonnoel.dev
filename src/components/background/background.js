import styles from './background.module.css';
import Script from 'next/script';

export default function Background() {

  return (
    <div className={styles.background} id="background">

      <Script>
        {`
            animationTimer();
            function animationTimer(){
              setTimeout(animationTimer,60000);
              
              if (document.getElementById("background").style.animationPlayState === 'running'){
                document.getElementById("background").style.animationPlayState = 'paused';
              }
              else{
                document.getElementById("background").style.animationPlayState = 'running';
              }

            }
            
        `}
      </Script>
      
      <canvas id="canvas" className={styles.canvas}></canvas>

        <Script strategy="beforeInteractive" src="/scripts/fabric.min.js"></Script>
        <Script strategy="beforeInteractive" src="/scripts/sprite.class.js"></Script>

        
        <Script src="/scripts/background_animation.js"> </Script>

    </div>
  )
}