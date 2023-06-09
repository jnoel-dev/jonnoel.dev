import styles from './background.module.css';
import Script from 'next/script';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export default function Background(props) {


  
  return (
    <>
    <div className={styles.background} id="background">



      
      <canvas id="canvas" ></canvas>

            
        <Script strategy="beforeInteractive" src="/scripts/fabric.min.js"></Script>
        <Script strategy="beforeInteractive" src="/scripts/sprite.class.js"></Script>
        <Script src="/scripts/background_animation.js"> </Script>

        <Script>
        {`
          console.log(${JSON.stringify(fullConfig.theme.colors.globalColor1)});
          let colorval = hexToRgb(${JSON.stringify(fullConfig.theme.colors.globalColor1)});
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
    {props.children}
    </>
  )
}