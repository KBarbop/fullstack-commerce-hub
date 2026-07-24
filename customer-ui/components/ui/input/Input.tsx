import React, { forwardRef } from "react";
import styles from "./input.module.css"; // Import your new styles

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  errorMessage?: string;
  touched?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, errorMessage, touched, ...props }, ref) => {
    return (
      <div className={styles.inp}>
        <input
          id={id}
          ref={ref}
          className={`${styles.input} ${errorMessage ? styles.inputError : ""}`}
          {...props}
          placeholder=" "
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <span className={styles.focusBg}></span>
        {touched && errorMessage && (
          <p className={styles.errorMessage}>{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
