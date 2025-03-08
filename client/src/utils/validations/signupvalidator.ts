import * as Yup from "yup";

interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const signupSchema: Yup.ObjectSchema<SignupFormValues> = Yup.object().shape({
  fullName: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long"),
  
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});