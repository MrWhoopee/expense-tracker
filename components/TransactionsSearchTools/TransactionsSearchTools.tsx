"use client";

import React from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";
import css from "@/components/TransactionsSearchTools/TransactionsSearchTools.module.css";
import Image from "next/image";

interface data {}

interface SearchFormValues {
  search: string;
  date: Date | null;
  category?: string;
}

const validationSchema = Yup.object({
  search: Yup.string(),
  date: Yup.date(),
});

const initialValues: SearchFormValues = {
  search: "",
  date: null,
};

const TransactionsSearchTools = (data: data) => {
  const handleSubmit = (
    values: SearchFormValues,
    actions: FormikHelpers<SearchFormValues>,
  ) => {
    console.log("Form submitted:", values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form className={css.form}>
          <div className={css.searchInputWrapper}>
            <Field
              name="search"
              placeholder="Search for anything..."
              className={css.searchInput}
              onBlur={() => submitForm()}
            />
            <div className={css.searchSvgContainer}>
              <Image src="/search.svg" alt="Search" width={20} height={20} />
            </div>
          </div>

          <div className={css.dateInputWrapper}>
            <DatePicker
              selected={values.date}
              //   onChange={(date) => {
              //     setFieldValue("date", date);
              //     submitForm(); /
              //   }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className={css.dateInput}
              isClearable
              autoComplete="off"
            />
            <div className={css.calendarSvgContainer}>
              <Image
                src="/calendar.svg"
                alt="Calendar"
                width={20}
                height={20}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TransactionsSearchTools;
