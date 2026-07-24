"use client";

import React from "react";
import Parallax from "@/components/ui/parallax/Parallax";
import classes from "./page.module.css";
import Campaigns from "@/components/ui/campaign/Campaigns";
import About from "@/components/ui/about/About";
import BackToTop from "@/components/ui/back-top/BackToTop";
import HeroBackground from "@/components/contact/HeroBackground";
import ImageSlideshow from "@/components/images/ImageSlideshow";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <BackToTop />

      <section className={classes.heroSection}>
        <HeroBackground />
        <div className={classes.textSection}>
          <h1>{t("sloganSlideshow")}</h1>
          <p>{t("sloganParagraphSlideshow")}</p>
        </div>
        <div className={classes.imageSection}>
          <ImageSlideshow />
        </div>
      </section>

      <div className={classes.slideshow}>
        <Parallax />
      </div>
      <main>
        <section className={classes.section}>
          <Campaigns />
        </section>
        <div id="about">
          <About />
        </div>
        {/* <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes,
            and to connect with other food lovers.
          </p>
          <p>
            NextLevel Food is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section> */}
      </main>
    </>
  );
};

export default Home;
