"use client";

import React from "react";
import classes from "./parallax.module.css";
import { useTranslation } from "react-i18next";

const HeroSlider: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={classes.parallaxWrapper}>
      <div className={classes.parallaxItem}>
        <div className={classes.parallaxContent}>
          <h1>{t("parallaxTitle")}</h1>
          <p>{t("parallaxP")}</p>
          <button
            onClick={() => window.open("https://example.com", "_blank", "noopener,noreferrer")}
          >
            {t("downloadTheApp")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
