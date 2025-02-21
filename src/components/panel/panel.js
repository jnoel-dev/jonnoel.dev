import anime from "animejs";
import { useEffect } from "react";
import styles from "./panel.module.css";

export default function Panel() {
  useEffect(() => {
    anime({
      loop: false,
      targets: "#background",
      easing: "linear",
    });
  }, []);

  return (
    <div className={styles.panel} >
      <div className="card-wrapper ">
        <div className="card-content ">
        </div>
      </div>
    </div>
  );
}
