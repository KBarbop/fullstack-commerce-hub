"use client";

import Login from "@/components/auth/login/Login";
import styles from "./page.module.css";

import AuthRedirect from "@/components/auth/hoc/AuthRedirect";

const LoginPage: React.FC = () => {
  return (
    <div className={styles.background}>
      <div className={styles.overlay}>
        <Login />
      </div>
    </div>
  );
};

export default AuthRedirect(LoginPage, {
  redirectIfAuthenticated: true,
  redirectTo: "/menu",
});
