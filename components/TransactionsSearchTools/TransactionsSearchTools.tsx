"use client";

import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./TransactionsSearchTools.module.css";
import Image from "next/image";
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
    } catch (error) {
      console.log("Error:", error);
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
              <Image src="/search.svg" alt="search" width={20} height={20} />
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
