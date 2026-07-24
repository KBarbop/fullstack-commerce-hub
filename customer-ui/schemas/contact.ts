import * as Yup from "yup";

export const contactSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required.")
    .min(3, "Full name must be at least 3 characters."),
  email: Yup.string()
    .required("Email is required.")
    .email("Email is invalid."),
  topic: Yup.string()
    .required("Your message has to contain a topic."),
  message: Yup.string()
    .required("Your message cannot be empty.")
});
