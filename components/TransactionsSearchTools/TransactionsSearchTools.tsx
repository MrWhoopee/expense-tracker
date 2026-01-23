"use client";

import React, { useEffect } from "react";
import { Field, Form, Formik, FormikHelpers, useFormikContext } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";
import css from "@/components/TransactionsSearchTools/TransactionsSearchTools.module.css";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

interface data {}

interface SearchFormValues {
  search: string;
  date: Date | null;
  category?: string;
}

const validationSchema = Yup.object({
  search: Yup.string(),
  date: Yup.date()
    .nullable()
    .typeError("Please enter a valid date (dd/mm/yyyy)")
    .max(new Date(), "Date cannot be in the future"),
});

// !check if typeError works

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

  const FormErrorObserver = () => {
    const { errors, touched } = useFormikContext<SearchFormValues>();

    useEffect(() => {
      if (errors.date && touched.date) {
        toast.error(errors.date as string);
      }
    }, [errors.date, touched.date]);

    return null;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form className={css.form}>
          <FormErrorObserver />
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

          <div className={css.datePickerWrapper}>
            <DatePicker
              selected={values.date}
              onChange={(date: Date | null) => {
                if (date && date > new Date()) {
                  toast.error("Date cannot be in the future", {
                    id: "date-limit",
                  });
                  return;
                }
                setFieldValue("date", date);
              }}
              //   onChange={(date) => {
              //     onChange(date);
              //   }}
              //   onChangeRaw={(e) => {
              //     if (!e) return;
              //     const input = e.currentTarget;
              //     if (!(input instanceof HTMLInputElement)) return;

              //     const formatted = input.value.replace(/[.-]/g, "/");
              //     input.value = formatted;
              //   }}
              //   onChangeRaw={(e: React.ChangeEvent<HTMLInputElement>) => {
              //     const input = e.currentTarget;
              //     // we only allow "/" and numbers
              //     let value = input.value.replace(/[^\d/]/g, "");

              //     // we only use "/"
              //     value = value.replace(/[.-]/g, "/");

              //     // length not more than 8 numbers + 2 "/"
              //     if (value.length > 10) {
              //       value = value.substring(0, 10);
              //     }

              //     input.value = value;
              //   }}

              // !edit onChangeRaw
              onChangeRaw={(e: React.FocusEvent<HTMLInputElement>) => {
                const input = e.target;
                let val = input.value.replace(/\D/g, ""); // we only allow numbers
                let finalVal = "";

                // only 8 digits allowed
                if (val.length > 8) {
                  val = val.substring(0, 8);
                  // added id to just show it once
                  toast.error("Maximum 8 digits allowed", { id: "date-limit" });
                }

                // it adds "/" automatically
                if (val.length > 0) {
                  finalVal += val.substring(0, 2);
                  if (val.length >= 2) {
                    finalVal += "/" + val.substring(2, 4);
                  }
                  if (val.length >= 4) {
                    finalVal += "/" + val.substring(4, 8);
                  }
                }

                input.value = finalVal;
              }}
              //   onBlur={() => {
              //     if (values.date) submitForm();
              //   }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const inputValue = e.target.value;

                // !check if it works
                if (inputValue && !values.date) {
                  toast.error("Format must be dd/mm/yyyy");
                }

                if (values.date) {
                  submitForm();
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              strictParsing
              //   maxDate={new Date()}
              className={css.dateInput}
              showPopperArrow={false}
              autoComplete="off"
              calendarStartDay={1}
              timeZone="UTC"
              locale="uk-UA"
              //   isClearable
              //   clearButtonClassName={css.dateClearBtn}
              previousMonthButtonLabel={
                <Image
                  src="/arrow-left.svg"
                  width={6}
                  height={10}
                  alt="previous month"
                  className={css.arrowLeft}
                  priority
                />
              }
              nextMonthButtonLabel={
                <Image
                  src="/arrow-right.svg"
                  width={6}
                  height={10}
                  alt="next month"
                  className={css.arrowRight}
                  priority
                />
              }
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
