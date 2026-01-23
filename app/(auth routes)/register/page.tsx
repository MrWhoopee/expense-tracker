"use client";
import css from "./RegisterPage.module.css";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { RegisterRequest, userRegister } from "@/lib/clientApi";

const initialValues: RegisterRequest = {
  name: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      setError("");

      const res = await userRegister(values);

      if (res) {
        router.push("/transactions/[transactionsType]");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      className={css.mainContent}
    >
      <Form className={css.form}>
        <div className={css.logicalWrapper}>
          <h1 className={css.formTitle}>Sign up</h1>
          <p className={css.formWelcomeText}>
            Step into a world of hassle-free expense management! Your journey
            towards financial mastery begins here.
          </p>
        </div>

        <div className={css.logicalWrapper}>
          <label htmlFor="name" className={css.visuallyHidden}>
            Name
          </label>
          <Field
            className={css.input}
            type="text"
            name="name"
            placeholder="Name"
            required
          />
          <label htmlFor="email" className={css.visuallyHidden}>
            Email
          </label>
          <Field
            className={css.input}
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <label htmlFor="password" className={css.visuallyHidden}>
            Password
          </label>
          <Field
            className={css.input}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        <div className={css.logicalWrapper}>
          <button className={css.submitButton} type="submit">
            Sign up
          </button>

          <p className={css.actionText}>
            Already have account? &#160;
            <Link className={css.actionTextLink} href={`/login`}>
              Sign in
            </Link>
          </p>
        </div>
      </Form>
    </Formik>
  );
}

// "use client";
// import css from "./RegisterPage.module.css";

// import Link from "next/link";

// export default function SignUp() {
//   const handleSubmit = () => {};

//   return (
//     <section className={css.mainContent}>
//       <form action={handleSubmit} className={css.form}>
//         <div className={css.logicalWrapper}>
//           <h1 className={css.formTitle}>Sign up</h1>
//           <p className={css.formWelcomeText}>
//             Step into a world of hassle-free expense management! Your journey
//             towards financial mastery begins here.
//           </p>
//         </div>

//         <div className={css.logicalWrapper}>
//           <label htmlFor="name" className={css.visuallyHidden}>
//             Name
//           </label>
//           <input
//             className={css.input}
//             type="text"
//             name="name"
//             placeholder="Name"
//             required
//           />
//           <label htmlFor="email" className={css.visuallyHidden}>
//             Email
//           </label>
//           <input
//             className={css.input}
//             type="email"
//             name="email"
//             placeholder="Email"
//             required
//           />
//           <label htmlFor="password" className={css.visuallyHidden}>
//             Email
//           </label>
//           <input
//             className={css.input}
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//         </div>

//         <div className={css.logicalWrapper}>
//           <button className={css.submitButton} type="submit">
//             Sign up
//           </button>

//           <p className={css.actionText}>
//             Already have account? &#160;
//             <Link className={css.actionTextLink} href={`/login`}>
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </form>
//     </section>
//   );
// }
