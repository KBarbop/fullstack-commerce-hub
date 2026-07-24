"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./footer.module.css";

import imgFooterLogo from "@/public/placeholder-logo.svg";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const leaderBanner = `${process.env.NEXT_PUBLIC_S3_URL}/banner_leader.png`;
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>{t("contact")}</h3>
          <p>Email: hello@example.com</p>
          <p>{t("phone")}: +1 555 0100</p>
          <p>
            {t("address")}: {t("businessAddress")}
          </p>
        </div>
        <div className={styles.section}>
          <h3>{t("company")}</h3>
          <Link href="/menu">
            <motion.p
              whileHover={{ scale: 1.1, color: "#ffcf00" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {t("menu")}
            </motion.p>
          </Link>
        </div>
        <div className={styles.section}>
          <h3>{t("information")}</h3>
          <Link href="/#about">
            <motion.p
              whileHover={{ scale: 1.1, color: "#ffcf00" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {t("whoWeAre")}
            </motion.p>
          </Link>
        </div>
        <div className={styles.section}>
          <Link href="/">
            <Image
              className={styles.imgFooterLogo}
              src={imgFooterLogo}
              alt="Portfolio Logo"
            />
          </Link>
          <Image
            className={styles.imgFooterLogo}
            src={leaderBanner}
            width="400"
            height="100"
            alt="Placeholder Banner"
          />
        </div>
      </div>
      <div className={styles.socialMedia} aria-hidden="true">
        {/*business social media links */}
        <motion.a
          href="#"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.2, rotate: 10, color: "#ffcf00" }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ display: "inline-block" }}
          aria-label="Instagram"
        >
          <em className="fab fa-instagram" aria-label="Instagram"></em>
        </motion.a>
        <motion.a
          href="#"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.2, rotate: 10, color: "#ffcf00" }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ display: "inline-block" }}
          aria-label="Facebook"
          aria-hidden="true"
        >
          <em className="fab fa-facebook" aria-label="Facebook"></em>
        </motion.a>
      </div>
    </footer>
  );
};

export default Footer;
