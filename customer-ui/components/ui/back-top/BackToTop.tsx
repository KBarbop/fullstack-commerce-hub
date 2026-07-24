"use client";

import { useState, useEffect } from "react";
import styles from "./back-to-top.module.css";

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className={styles.backToTopButton}>
      {isVisible && (
        <button onClick={scrollToTop} className={styles.button}>
          ↑
        </button>
      )}
    </div>
  );
};

export default BackToTop;
