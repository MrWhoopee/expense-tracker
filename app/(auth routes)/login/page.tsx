"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

import { userLogin } from "@/lib/clientApi";
import css from "./LoginPage.module.css";

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
        setServerError(err.response?.data?.message || "Login failed. Please try again.");
      } else {
        setServerError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={css.mainContent}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched }) => (
          <Form className={css.form}>
            <div className={css.logicalWrapper}>
              <h1 className={css.formTitle}>Sign in</h1>
              <p className={css.formWelcomeText}>
                Welcome back to effortless expense tracking! Your financial
                dashboard awaits.
              </p>
            </div>

            <div className={css.logicalWrapper}>
              {/* Email Field */}
              <div className={css.inputFieldWrapper}>
                <label htmlFor="email" className={css.visuallyHidden}>Email</label>
                <Field
                  className={clsx(css.input, {
                    [css.errorInput]: errors.email && touched.email,
                  })}
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                />
                <ErrorMessage name="email" component="span" className={css.error} />
              </div>

              {/* Password Field */}
              <div className={css.inputFieldWrapper}>
                <label htmlFor="password" className={css.visuallyHidden}>Password</label>
                <div className={css.passwordInputContainer}>
                  <Field
                    className={clsx(css.input, {
                      [css.errorInput]: errors.password && touched.password,
                    })}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={css.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage name="password" component="span" className={css.error} />
              </div>
            </div>

            {/* Вивід помилки сервера */}
            {serverError && <div className={css.error}>{serverError}</div>}

            <div className={css.logicalWrapper}>
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
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}