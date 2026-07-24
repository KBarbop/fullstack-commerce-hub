import Image from "next/image";

import styles from "./about.module.css";
import { useTranslation } from "react-i18next";

const About: React.FC = () => {
  const { t } = useTranslation();
  const aboutImage = "/placeholder-hero.svg";
  return (
    <section className={styles.aboutInfo}>
      <div className={styles.aboutImg}>
        <Image
          src={aboutImage}
          alt="Placeholder company image"
          width={800}
          height={600}
          decoding="async"
          data-nimg="fill"
          priority
        />
      </div>
      <div className={styles.aboutContent}>
        <p className={styles.aboutContentCheck}>{t("aboutUs")}</p>
        <p>{t("aboutusParagraph")}</p>
      </div>
    </section>
  );
};

export default About;
