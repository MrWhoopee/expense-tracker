"use client";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import css from "./TransactionsSearchTools.module.css";
import CustomDatePicker from "../ui/CustomDatePicker";
import toast from "react-hot-toast";

interface SearchFormValues {
  search: string;
  date: Date | null;
}

const validationSchema = Yup.object({
  search: Yup.string(),
  date: Yup.date().nullable(),
  // .typeError("Please enter a valid date (dd/mm/yyyy)")
  // .max(new Date(), "Date cannot be in the future"),
});
// !check if typeError works

const initialValues: SearchFormValues = {
  search: "",
  date: null,
};

const TransactionsSearchTools = () => {
  const handleSubmit = (
    values: SearchFormValues,
    // actions: FormikHelpers<SearchFormValues>,
  ) => {
    // console.log("Form submitted:", values);
    // actions.resetForm();
    try {
      console.log("Searching by comment keyword:", values.search);
      console.log("Filtering by date:", values.date);

      // await getTransactionByQuery(values.search, values.date);
    } catch {
      toast.error("Failed to fetch transactions. Please try again.");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false} // no spam validation
      validateOnBlur={false} // to not block DatePicker's onBlur
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form className={css.form}>
          <div className={css.searchInputWrapper}>
            <Field
              name="search"
              type="text"
              placeholder="Search for anything..."
              className={css.searchInput}
              onBlur={() => submitForm()}
            />
            <div className={css.searchSvgContainer}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 17.5L13.875 13.875"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <CustomDatePicker
            values={values.date}
            setFieldValue={setFieldValue}
            submitForm={submitForm}
          />
        </Form>
      )}
    </Formik>
  );
};

export default TransactionsSearchTools;
