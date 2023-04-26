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
      
      <canvas id="canvas" className={styles.canvas} ></canvas>

        
        <Script strategy="beforeInteractive" src="/scripts/fabric.min.js"></Script>
        <Script strategy="beforeInteractive" src="/scripts/sprite.class.js"></Script>

        
        <Script src="/scripts/background_animation.js"> </Script>

        <Script>
        {`
          let globalColors = [];
          globalColors.push(window.getComputedStyle(document.getElementById("main_body")).getPropertyValue('--global-color1'));
          globalColors.push(window.getComputedStyle(document.getElementById("main_body")).getPropertyValue('--global-color2'));
          globalColors.push(window.getComputedStyle(document.getElementById("main_body")).getPropertyValue('--global-color3'));
          globalColors.push(window.getComputedStyle(document.getElementById("main_body")).getPropertyValue('--global-color4'));
          globalColors.push(window.getComputedStyle(document.getElementById("main_body")).getPropertyValue('--global-color5'));
          globalColors.push(window.getComputedStyle(document.getElementById("main_body")).getPropertyValue('--global-color6'));
          localStorage.setItem('test',globalColors);

          let colorval = hexToRgb(window.getComputedStyle(document.getElementById("main_body")).getPropertyValue('--global-color1'));
          let finalval = \`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="689d94" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 \${colorval.r} 0 0 0 0 \${colorval.g} 0 0 0 0 \${colorval.b} 0 0 0 1 0"/></filter></defs></svg>#689d94')\`
          document.getElementById("canvas").style.filter = finalval;
          
          
          function hexToRgb(hex) {
            var result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16)/255,
              g: parseInt(result[2], 16)/255,
              b: parseInt(result[3], 16)/255
            } : null;
          }
          
        `}
      </Script>

    </div>
  )
}