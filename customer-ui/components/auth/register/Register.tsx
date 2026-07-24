"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/schemas/register";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "@/store/auth-slice/auth-slice";
import { RootState, AppDispatch } from "@/store/store";
import { RegisterFormValues } from "@/types/auth";
import Input from "@/components/ui/input/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import { useTranslation } from "react-i18next";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.auth
  );

  const [showError, setShowError] = useState<boolean>(false);
  const [customErrorMessage, setCustomErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    const { confirmPassword, ...formData } = data;
    dispatch(registerUser(formData)).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setShowError(true);
        setCustomErrorMessage(t("registerFailedPleaseTryAgain"));
      }
    });
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("register")}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.gridContainer}>
          <Input
            id="email"
            type="email"
            label="Email"
            {...register("email")}
            errorMessage={errors.email?.message}
            touched={touchedFields.email}
          />
          <Input
            id="username"
            type="text"
            label={t("username")}
            {...register("username")}
            errorMessage={errors.username?.message}
            touched={touchedFields.username}
          />

          <Input
            id="password"
            type="password"
            label={t("password")}
            {...register("password")}
            errorMessage={errors.password?.message}
            touched={touchedFields.password}
          />

          <Input
            id="confirmPassword"
            type="password"
            label={t("confirmPassword")}
            {...register("confirmPassword")}
            errorMessage={errors.confirmPassword?.message}
            touched={touchedFields.confirmPassword}
          />
          <Input
            id="firstName"
            type="text"
            label={t("firstName")}
            {...register("firstName")}
            errorMessage={errors.firstName?.message}
            touched={touchedFields.firstName}
          />
          <Input
            id="lastName"
            type="text"
            label={t("lastName")}
            {...register("lastName")}
            errorMessage={errors.lastName?.message}
            touched={touchedFields.lastName}
          />
          <Input
            id="phoneNumber"
            type="number"
            label={t("phone")}
            {...register("phoneNumber")}
            errorMessage={errors.phoneNumber?.message}
            touched={touchedFields.phoneNumber}
          />
        </div>

        <button
          className={styles.button}
          type="submit"
          disabled={loading}
          style={{ position: "relative" }}
        >
          {loading ? (
            <div aria-hidden="true">
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : (
            t("signUp")
          )}
        </button>

        {showError && (
          <p className={styles.error}>
            {customErrorMessage || t("registerFailedPleaseTryAgain")}
          </p>
        )}
        {success && (
          <p className={styles.success}>{t("registerSuccessRedirecting")} </p>
        )}
      </form>

      <div className={styles.switchContainer}>
        <p className={styles.switchText}>
          {t("alreadyHaveAnAccount")}{" "}
          <Link href="/auth/login" className={styles.switchLink}>
            {t("login")}!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
