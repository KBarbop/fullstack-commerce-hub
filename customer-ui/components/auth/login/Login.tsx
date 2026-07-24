import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { loginSchema } from "@/schemas/login";
import Input from "@/components/ui/input/Input";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { login } from "@/store/auth-slice/auth-slice";

import { useState, useEffect } from "react";

import styles from "./login.module.css";
import { useTranslation } from "react-i18next";
import { LoginProps } from "@/types";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [showError, setShowError] = useState<boolean>(false);
  const [customErrorMessage, setCustomErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginProps>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginProps> = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      router.push("/menu");
    } else {
      setShowError(true);
      setCustomErrorMessage(t("loginFailedpleaseTryAgain"));
    }
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
      <h2 className={styles.title}>{t("login")}</h2>
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
            id="password"
            type="password"
            label={t("password")}
            {...register("password")}
            errorMessage={errors.password?.message}
            touched={touchedFields.password}
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
            t("signIn")
          )}
        </button>
        {showError && <p className={styles.error}>{customErrorMessage}</p>}
      </form>
      <div className={styles.switchContainer}>
        <p className={styles.switchText}>
          {t("dontHaveAnAccount")}{" "}
          <Link className={styles.switchLink} href="/auth/register">
            {t("createOne")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
