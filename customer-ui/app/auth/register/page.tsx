"use client";

import React from "react";
import Register from "@/components/auth/register/Register";
import styles from "./page.module.css";
import AuthRedirect from "@/components/auth/hoc/AuthRedirect";

const RegisterPage: React.FC = () => {
  return (
    <div className={styles.background}>
      <div className={styles.overlay}>
        <Register />
      </div>
    </div>
  );
};

export default AuthRedirect(RegisterPage, {
  redirectIfAuthenticated: true,
  redirectTo: "/menu",
});
