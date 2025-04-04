import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters long"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits"),
    about: Yup.string()
      .max(500, "About section cannot exceed 500 characters")
      .nullable(),
  });