import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import usFlag from "@/assets/icons/us.svg";
import grFlag from "@/assets/icons/gr.svg";
import styles from "./language-switcher.module.css";

const languages = [
  { code: "en", name: "English", flag: usFlag },
  { code: "el", name: "Greek", flag: grFlag },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={styles.switcherContainer}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.languageButton}
      >
        <svg
          className={styles.icon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 9l6 6 6-6"
          />
        </svg>
        {languages.map(
          (lang) =>
            lang.code === selectedLanguage && (
              <span key={lang.code} className={styles.languageSelected}>
                <Image
                  src={lang.flag}
                  alt={`Select ${lang.name} language`}
                  className={styles.flagImage}
                  width={16}
                  height={12}
                />
                <span className={styles.languageName}>{lang.name}</span>
              </span>
            )
        )}
      </button>
      {isOpen && (
        <ul className={styles.languageDropdown}>
          {languages
            .filter((lang) => lang.code !== selectedLanguage)
            .map((lang) => (
              <li
                key={lang.code}
                className={styles.languageOption}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <Image
                  src={lang.flag}
                  alt={`Select ${lang.name} language`}
                  className={styles.flagImage}
                  width={16}
                  height={12}
                />
                <span className={styles.languageName}>{lang.name}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
