"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTranslation } from "react-i18next";
import PersonalInformationForm from "@/components/profile/personal-info/PersonalInformationForm";
import FavoriteAddressesForm from "@/components/profile/addresses-info/AddressesInformationForm";
import AuthRedirect from "@/components/auth/hoc/AuthRedirect";
import OrdersHistory from "@/components/profile/orders-history/ordersHistory";

import classes from "./page.module.css";
import HeroBackground from "@/components/contact/HeroBackground";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [direction, setDirection] = useState<string>("");

  const handleTabChange = (newTab: number) => {
    if (newTab !== activeTab) {
      if (newTab > activeTab) {
        setDirection("left");
      } else {
        setDirection("right");
      }
      setTimeout(() => {
        setActiveTab(newTab);
      }, 300);
    }
  };

  return (
    <>
      <HeroBackground />
      <div className={classes.profileContainer}>
        <div className={classes.profileCard}>
          <h1 className={classes.title}>
            {t("welcome")} {user?.username}
          </h1>

          <div className={classes.section}>
            <p>{t("welcomeParagraph")}</p>
            <PersonalInformationForm />
          </div>
        </div>
        <div className={classes.profileCard}>
          <div className={classes.section}>
            <div className={classes.tabsContainer}>
              <button
                className={`${classes.tabButton} ${
                  activeTab === 0 ? classes.activeTab : ""
                }`}
                onClick={() => handleTabChange(0)}
              >
                {t("addresses")}
              </button>
              <button
                className={`${classes.tabButton} ${
                  activeTab === 1 ? classes.activeTab : ""
                }`}
                onClick={() => handleTabChange(1)}
              >
                {t("orders")}
              </button>
            </div>
          </div>

          <div className={`${classes.tabContent} ${classes[direction]}`}>
            <div className={classes.tabContentWrapper}>
              {activeTab === 0 ? <FavoriteAddressesForm /> : <OrdersHistory />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthRedirect(ProfilePage, {
  redirectIfAuthenticated: false,
  redirectTo: "/auth/login",
});
