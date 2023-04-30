import anime from 'animejs';
import { useEffect } from 'react';
import styles from './panel.module.css'

export default function Panel() {

  useEffect(() => {
    anime({
      loop: false,
      targets: "#background",
      easing: "linear",
    });
  }, []);
  
  return (
  <div className={styles.panel}>
  <div className="w-1/4 mx-auto bg-globalColor3 p-60 rounded-3xl border-4 border-globalColor6">

      <h3 className="text-lg font-medium text-globalColor1">Several Windows stacked on each other</h3>
      <p className="text-sm font-light text-globalColor1">
      The accordion is a graphical control element comprising a vertically stacked list of items such as labels or thumbnails
      </p>
   
  </div> 
  </div>

  )
}