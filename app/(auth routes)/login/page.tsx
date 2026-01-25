"use client";
import BgImageWrapper from "@/components/BgImageWrapper/BgImageWrapper";
import css from "./LoginPage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { userLogin } from "@/lib/clientApi";

// Схема валідації (ідентична реєстрації, але без name)
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .max(64, "Email must contain no more than 64 characters"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must contain no more than 64 characters")
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

export default function SignIn() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      setServerError(null);

      const res = await userLogin(values);

      if (res) {
        router.refresh();
        router.push("/transactions"); // Або /transactions за логікою вашого проекту
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data?.message || "Login failed. Please try again.",
        );
      } else {
        setServerError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={css.mainContent}>
      <BgImageWrapper />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched, handleChange }) => (
          <Form className={css.form}>
            <h1 className={css.formTitle}>Sign in</h1>
            <p className={css.formWelcomeText}>
              Welcome back to effortless expense tracking! Your financial
              dashboard awaits.
            </p>

            {/* Email Field */}

            {/* <label htmlFor="email" className={css.visuallyHidden}>
                Email
              </label> */}
            <div className={css.passwordInputContainer}>
              <Field
                className={clsx(css.input, {
                  [css.errorInput]: errors.email && touched.email,
                })}
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setServerError(null);
                }}
              />
              <ErrorMessage
                name="email"
                component="span"
                className={css.error}
              />
            </div>

            {/* Password Field */}

            {/* <label htmlFor="password" className={css.visuallyHidden}>
              Password
            </label> */}
            <div className={css.passwordInputContainer}>
              <Field
                className={css.input}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setServerError(null);
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
              {serverError && <div className={css.error}>{serverError}</div>}
            </div>

            <button
              className={css.submitButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className={css.actionText}>
              {"Don't have an account?"} &#160;
              <Link className={css.actionTextLink} href="/register">
                Sign up
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </section>
  );
}
