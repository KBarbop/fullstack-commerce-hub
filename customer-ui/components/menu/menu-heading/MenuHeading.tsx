import styles from "./menu-heading.module.css";

const MenuHeading: React.FC = () => {
  return (
    <div className={styles.deliverySection}>
      <div className={styles.deliveryBackground}>
        <svg
          className={styles.topWave}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1900 395"
          enableBackground="new 0 0 2000 295"
        >
          <path
            fill="#dbb418"
            d="M947.637,0l0.279,2.253c48.244,0,137.059,21.504,199.307,25.411C1527.777,37.411,1735.613,295,2000,295V0H947.637z"
          >
            <animate
              repeatCount="indefinite"
              fill="#dbb418"
              attributeName="d"
              dur="8s"
              attributeType="XML"
              values="
                M947.637,0l0.279,2.253c48.244,0,137.059,21.504,199.307,25.411C1527.777,37.411,1735.613,295,2000,295V0H947.637z;
                M947.637,0l0.279,2.253c48.244,0,137.059,21.504,199.307,25.411C1527.777,37.411,1735.613,195,2000,295V0H947.637z;
                M947.237,0l0.279,2.253c48.244,0,137.059,11.204,399.307,15.111C1527.777,37.411,1735.613,295,2000,295V0H947.637z;
                M947.637,0l0.279,2.253c48.244,0,137.059,21.504,199.307,25.411C1527.777,37.411,1735.613,295,2000,295V0H947.637z"
            />
          </path>
        </svg>
        <svg
          className={styles.bottomWave}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2400 272"
          enableBackground="new 0 0 2000 272"
        >
          <path
            fill="#dbb418"
            d="M941.243,272c-44.485-10.771-90.768-22.055-121.964-24.014C438.725,238.232,264.387,0,0,0v272H941.243z"
          >
            <animate
              repeatCount="indefinite"
              fill="#dbb418"
              attributeName="d"
              dur="10s"
              attributeType="XML"
              values="
                M941.243,272c-44.485-10.771-90.768-22.055-121.964-24.014C438.725,238.232,264.387,0,0,0v272H941.243z;
                M941.243,272c-144.485-10.771-190.768-22.055-221.964-24.014C438.725,338.232,264.387,0,0,0v272H941.243z;
                M941.543,272c-44.485-10.771-90.768-22.055-121.264-24.014C438.725,238.232,364.387,0,0,0v272H941.243z;
                M941.243,272c-44.485-10.771-90.968-22.055-121.964-24.014C438.725,238.232,264.387,0,0,0v272H941.243z"
            />
          </path>
        </svg>
      </div>
      <div className={styles.deliveryContent}>
        <div className={styles.deliveryText}>
          <span className={styles.deliveryLabel}>DELIVERY</span>
        </div>
      </div>
    </div>
  );
};
export default MenuHeading;
