"use client";

import { useFormik, FormikHelpers } from "formik";
import { contactSchema } from "@/schemas/contact";

import Input from "@/components/ui/input/Input";

import { ContactFormValues } from "@/types";

import styles from "./contact-form.module.css";
import { useTranslation } from "react-i18next";

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const onSubmit = async (
    values: ContactFormValues,
    actions: FormikHelpers<ContactFormValues>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    actions.resetForm();
  };

  const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
    useFormik<ContactFormValues>({
      initialValues: {
        fullName: "",
        email: "",
        topic: "",
        message: "",
      },
      onSubmit,
      validationSchema: contactSchema,
    });

  const inputs = [
    {
      id: "fullName",
      name: "fullName",
      type: "text",
      placeholder: t("yourFullName"),
      value: values.fullName,
      errorMessage: errors.fullName,
      touched: touched.fullName,
    },
    {
      id: "email",
      name: "email",
      type: "email",
      placeholder: t("yourEmail"),
      value: values.email,
      errorMessage: errors.email,
      touched: touched.email,
    },
    {
      id: "topic",
      name: "topic",
      type: "text",
      placeholder: t("headingOfMessage"),
      value: values.topic,
      errorMessage: errors.topic,
      touched: touched.topic,
    },
  ];

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        {inputs.map((input) => (
          <Input
            key={input.id}
            label={input.placeholder}
            {...input}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ))}
        <label htmlFor="message" className={styles.textareaLabel}>
          {t("yourMessage")}
        </label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.message && touched.message && (
          <div className={styles.error}>{errors.message}</div>
        )}
      </div>
      <button className={`btn-primary ${styles.buttonPrimary}`} type="submit">
        {t("sendUsaMessage")}
      </button>
    </form>
  );
};

export default ContactForm;
