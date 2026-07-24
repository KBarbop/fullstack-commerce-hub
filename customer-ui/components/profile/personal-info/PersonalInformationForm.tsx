"use client";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { editUserData } from "@/store/auth-slice/auth-slice";
import classes from "./personal-info.module.css";
import { useTranslation } from "react-i18next";
import { FiEdit } from "react-icons/fi";
import { FiKey } from "react-icons/fi";

interface PersonalInformation {
  username: string;
  firstName: string;
  lastName: string;
}

const PersonalInformationForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [info, setInfo] = useState<PersonalInformation>({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user && user._id) {
      dispatch(editUserData({ ...info, _id: user._id }));
    }

    handleClosePersonalInfo();
  };

  const handleOpenPersonalInfo = () => setIsPersonalInfoOpen(true);
  const handleClosePersonalInfo = () => setIsPersonalInfoOpen(false);

  const handleOpenPasswordChange = () => setIsPasswordChangeOpen(true);
  const handleClosePasswordChange = () => setIsPasswordChangeOpen(false);

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleClosePasswordChange();
  };
  return (
    <>
      <div className={classes.container}>
        <div className={classes.card}>
          <div className={classes.formGroup}>
            <label className={classes.label}>{t("username")}:</label>
            <span className={classes.info}>{info.username}</span>
          </div>

          <div className={classes.formGroup}>
            <label className={classes.label}>{t("firstName")}:</label>
            <span className={classes.info}>{info.firstName}</span>
          </div>

          <div className={classes.formGroup}>
            <label className={classes.label}>{t("lastName")}:</label>
            <span className={classes.info}>{info.lastName}</span>
          </div>
        </div>

        <div className={classes.btnContainer}>
          <button
            className={classes.btnChangePassword}
            type="button"
            onClick={handleOpenPersonalInfo}
          >
            <FiEdit style={{ marginRight: "8px" }} /> {t("editPersonalInfo")}
          </button>
          <button
            className={classes.btnChangePassword}
            type="button"
            onClick={handleOpenPasswordChange}
          >
            <FiKey style={{ marginRight: "8px" }} /> {t("changePassword")}
          </button>
        </div>
      </div>

      <div
        className={isPersonalInfoOpen ? classes.overlay : ""}
        onClick={handleClosePersonalInfo}
      ></div>
      <div
        className={`${classes.personalInfoModal} ${
          isPersonalInfoOpen ? classes.slideIn : ""
        }`}
      >
        <div className={classes.personalInfoModalContent}>
          <button
            className={classes.closeModal}
            onClick={handleClosePersonalInfo}
          >
            &times;
          </button>
          <h3>{t("editPersonalInfo")}</h3>
          <form onSubmit={handleSubmit}>
            <label className={classes.modalLabel}>
              {t("username")}:
              <input
                className={classes.modalInput}
                type="text"
                name="username"
                value={info.username}
                onChange={handleChange}
                required
              />
            </label>
            <label className={classes.modalLabel}>
              {t("firstName")}:
              <input
                className={classes.modalInput}
                type="text"
                name="firstName"
                value={info.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label className={classes.modalLabel}>
              {t("lastName")}:
              <input
                className={classes.modalInput}
                type="text"
                name="lastName"
                value={info.lastName}
                onChange={handleChange}
                required
              />
            </label>
            <button className={classes.modalButton} type="submit">
              {t("saveChanges")}
            </button>
          </form>
        </div>
      </div>
      <div
        className={isPasswordChangeOpen ? classes.overlay : ""}
        onClick={handleClosePasswordChange}
      ></div>
      <div
        className={`${classes.passwordModal} ${
          isPasswordChangeOpen ? classes.slideIn : ""
        }`}
      >
        <div className={classes.passwordModalContent}>
          <button
            className={classes.closeModal}
            onClick={handleClosePasswordChange}
          >
            &times;
          </button>
          <h3>{t("changePassword")}</h3>
          <form onSubmit={handlePasswordChangeSubmit}>
            <label className={classes.modalLabel}>
              {t("currentPassword")}:
              <input
                className={classes.modalInput}
                type="password"
                name="currentPassword"
                required
              />
            </label>
            <label className={classes.modalLabel}>
              {t("newPassword")}:
              <input
                className={classes.modalInput}
                type="password"
                name="newPassword"
                required
              />
            </label>
            <button className={classes.modalButton} type="submit">
              {t("saveChanges")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInformationForm;
