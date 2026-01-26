"use client";
import css from "./RegisterPage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { RegisterRequest, userRegister } from "@/lib/clientApi";
import clsx from "clsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";
import BgImageWrapper from "@/components/BgImageWrapper/BgImageWrapper";

const initialValues: RegisterRequest = {
  name: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must contain at least 2 characters")
    .max(32, "Name must contain no more than 32 characters")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Name can only contain latin letters and spaces (no dots or special characters)",
    )
    .required("Name is required"),
  email: Yup.string()
    .required("Email is required")
    .max(64, "Email must contain no more than 64 characters")
    .matches(
      /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email format is invalid (dots are not allowed before @)",
    ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must contain no more than 64 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      setServerError("");

      const res = await userRegister(values);

      if (res) {
        setUser(res);
        router.push("/");
      }
    } catch (err) {
      setServerError("Registration failed. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.mainContent}>
      <BgImageWrapper />
      <div className={css.formContainer}>
        <h1 className={css.formTitle}>Sign up</h1>
        <p className={css.formWelcomeText}>
          Step into a world of hassle-free expense management! Your journey
          towards financial mastery begins here.
        </p>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          className={css.mainContent}
        >
          {({ errors, touched, handleChange }) => (
            <Form className={css.form}>
              <label className={css.inputContainer}>
                <span className={css.visuallyHidden}>Name</span>
                <Field
                  className={clsx(css.input, {
                    [css.errorInput]: errors.name && touched.name,
                  })}
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    setServerError("");
                  }}
                />
                <ErrorMessage
                  name="name"
                  component="span"
                  className={css.error}
                />
              </label>

              <label className={css.inputContainer}>
                <span className={css.visuallyHidden}>Email</span>
                <Field
                  className={clsx(css.input, {
                    [css.errorInput]: errors.email && touched.email,
                  })}
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    setServerError("");
                  }}
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className={css.error}
                />
              </label>

              <label className={css.inputContainer}>
                <span className={css.visuallyHidden}>Password</span>
                <Field
                  className={clsx(css.input, {
                    [css.errorInput]: errors.password && touched.password,
                  })}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    setServerError("");
                  }}
                />

                <button
                  type="button"
                  className={css.passwordToggle}
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <ErrorMessage
                  name="password"
                  component="span"
                  className={css.error}
                />
                {serverError && <p className={css.error}>{serverError}</p>}
              </label>

              <button className={css.submitButton} type="submit">
                {loading ? "Signing up..." : "Sign up"}
              </button>
              <p className={css.actionText}>
                Already have account? &#160;
                <Link className={css.actionTextLink} href={`/login`}>
                  Sign in
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
