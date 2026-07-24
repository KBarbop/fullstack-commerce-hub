"use client";

import { useRef, useState, useEffect } from "react";
import { FaUserAlt, FaShoppingCart, FaSignOutAlt, FaCog } from "react-icons/fa";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logoutUser } from "@/store/auth-slice/auth-slice";
import Logo from "@/components/ui/logo/Logo";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./header.module.css";
import LanguageSwitcher from "@/components/language-switcher/LanguageSwitcher";
import useAuth from "@/util/auth/useAuth";

const Header: React.FC = () => {
  const [isMenuModal, setIsMenuModal] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const cart = useSelector((state: RootState) => state.cart);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loading = useAuth();
  const [initialLoad, setInitialLoad] = useState(true);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (loading === false) {
      setInitialLoad(false);
    }
  }, [loading]);

  const isAuthPage = pathname.includes("auth");
  const isProfilePage = pathname === "/profile";

  return (
    <div
      className={`${styles.header} ${
        pathname === "/" ? styles.bgTransparent : styles.bgSecondary
      }`}
    >
      <div className={styles.container}>
        <Logo />
        <nav
          className={`${styles.nav} ${
            isMenuModal ? styles.menuModalActive : ""
          }`}
        >
          <ul className={styles.navList}>
            <li
              className={isProfilePage ? styles.profileLink : styles.navItem}
              onClick={() => setIsMenuModal(false)}
            >
              <Link href="/">{t("home")}</Link>
            </li>
            <li
              className={isProfilePage ? styles.profileLink : styles.navItem}
              onClick={() => setIsMenuModal(false)}
            >
              <Link href="/menu">{t("menu")}</Link>
            </li>
            <li
              className={isProfilePage ? styles.profileLink : styles.navItem}
              onClick={() => setIsMenuModal(false)}
            >
              <Link href="/contact">{t("contact")}</Link>
            </li>
          </ul>
          {isMenuModal && (
            <button
              className={styles.cancelButton}
              onClick={() => setIsMenuModal(false)}
            >
              <GiCancel size={25} className={styles.icon} />
            </button>
          )}
        </nav>

        <div className={styles.icons}>
          <LanguageSwitcher />
          {!isAuthPage && (
            <>
              {initialLoad ? (
                <div className={styles.loadingSpinner}></div>
              ) : user ? (
                <div className={styles.userDropdownContainer} ref={dropdownRef}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <FaUserAlt
                      className={`${styles.icon} ${
                        isProfilePage ? styles.profileIcon : styles.textPrimary
                      }`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                  </motion.div>
                  {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <Link href="/profile">
                        <div
                          className={styles.dropdownItem}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog className={styles.dropdownIcon} />{" "}
                          {t("profile")}
                        </div>
                      </Link>
                      <div
                        className={styles.dropdownItem}
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className={styles.dropdownIcon} />
                        {t("logout")}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className={styles.loginRegisterButton}
                  >
                    {t("loginRegister")}
                  </motion.button>
                </Link>
              )}
            </>
          )}

          <Link href="/cart">
            <span className={styles.cartIconContainer}>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaShoppingCart
                  className={isProfilePage ? styles.profileIcon : styles.icon}
                />
                <span className={styles.cartBadge}>
                  {cart.items.length === 0 ? "0" : cart.items.length}
                </span>
              </motion.div>
            </span>
          </Link>
          <button
            className={styles.menuButton}
            onClick={() => setIsMenuModal(true)}
          >
            <GiHamburgerMenu
              className={isProfilePage ? styles.profileIcon : styles.icon}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
