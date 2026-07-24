"use client";

import { FC } from "react";
import ContactForm from "@/components/contact/ContactForm";
import HeroBackground from "@/components/contact/HeroBackground";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";

// import ImageSlideshow from "@/components/images/ImageSlideshow";

const Contact: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.contactPage}>
      <section className={styles.heroSection}>
        <HeroBackground />

        <div className={styles.textSection}>
          <h1>{t("getInTouch")}</h1>
          <p>{t("contactParagraph")}</p>

          <div className={styles.iframeContainer}>
            {/* location of business*/}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.0!2d-0.1278!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zPlaceholder+Location!5e0!3m2!1sen!2snl"
              width="600"
              height="450"
              loading="lazy"
              className={styles.iframe}
            ></iframe>
          </div>
        </div>
        <div className={styles.formSection}>
          <ContactForm />
        </div>
      </section>
      <section className={styles.formSection}></section>
      {/* <section className={styles.cardsSection}> TODO:Will use or not, will be decided later
        <div className={styles.infoCard}>
          <i
            className="fas fa-phone"
            style={{ fontSize: "2rem", color: "#0070f3" }}
          ></i>
          <h3>Talk to Sales</h3>
          <p>
            Interested in our services? Just pick up the phone to chat with a
            member of our sales team.
          </p>
          <a href="tel:+35315124400" className={styles.contactLink}>
            +353 1 512 4400
          </a>
        </div>
        <div className={styles.infoCard}>
          <i
            className="fas fa-headset"
            style={{ fontSize: "2rem", color: "#0070f3" }}
          ></i>
          <h3>Contact Customer Support</h3>
          <p>
            Need help? Our support team is here to assist you. Reach out to us
            and we'll take care of it.
          </p>
          <a href="mailto:support@example.com" className={styles.contactLink}>
            support@example.com
          </a>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;
