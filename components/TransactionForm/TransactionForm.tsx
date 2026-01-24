"use client";

import {
  Field,
  Form,
  Formik,
  ErrorMessage,
  FieldProps,
  FormikProps,
} from "formik";
import * as Yup from "yup";
import css from "./TransactionForm.module.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";
import CategoriesModal from "../CategoriesModal/CategoriesModal";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { createTransaction2, getUser } from "@/lib/clientApi";

type TransactionType = "Expense" | "Income";

interface FormValues {
  type: TransactionType;
  date: Date;
  time: Date;
  category: string;
  sum: string | number;
  comment: string;
}

const getInitialValues = (data?: FormValues): FormValues => ({
  type: data?.type ?? "Expense",
  date: data?.date ?? new Date(),
  time: data?.time ?? new Date(),
  category: data?.category ?? "",
  sum: data?.sum ?? "",
  comment: data?.comment ?? "",
});

interface TransactionFormProps {
  transactionData?: FormValues;
}

const TransactionForm = ({ transactionData }: TransactionFormProps) => {
  const [values, setValues] = useState<TransactionType>("Expense");

  //   const { data, error, isLoading } = useQuery({
  //     queryKey: ["getUserCurrent"],
  //     queryFn: () => getUser(),
  //     refetchOnMount: false,
  //   });
  const data = {
    currency: "UAH",
    categories: {
      incomes: [
        {
          _id: "6522bf1f9027bb7d55d6512b",
          categoryName: "Salary",
          type: "incomes",
        },
      ],
      expenses: [
        {
          _id: "6522bf1f9027bb7d55c1973a",
          categoryName: "Car",
          type: "expenses",
        },
        {
          _id: "6522bf1f9027bb7d55c19731",
          categoryName: "Carrot",
          type: "expenses",
        },
        {
          _id: "6522bf1f9027bb7d44c19731",
          categoryName: "Fish",
          type: "expenses",
        },
      ],
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const isEditMode = !!transactionData;
  const isEditMode = false;

  const initialValues = getInitialValues(transactionData);

  //   const queryClient = useQueryClient();

  const handleSubmit = (data: FormValues) => {
    // createNoteMutation.mutate(data);
    console.log("Hello" + data);
  };

  //   const createNoteMutation = useMutation({
  //     mutationKey: ["createTransaction"],
  //     mutationFn: (data: FormValues) => createTransaction2(data),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["getNotes"] });
  //       setIsModalOpen(false);
  //     },
  //   });

  const FormSchema = Yup.object().shape({
    transactionType: Yup.mixed<TransactionType>()
      .oneOf(["Expense", "Income"], "Invalid type")
      .required("Type is required"),
    date: Yup.date().required("Date is required"),
    time: Yup.date().required("Time is required"),
    category: Yup.string().required("Category is required"),
    sum: Yup.number()
      .typeError("Must be a number")
      .required("Sum is required")
      .integer("Must be an integer")
      .min(1, "Must be at least 1")
      .max(1000000, "Must be at most 1000000"),
    comment: Yup.string().min(3, "Min 3 chars").max(48, "Max 48 chars"),
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`${css["transaction-form-wrapper"]} ${isEditMode ? css["transaction-form-wrapper-with-close"] : ""}`}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={FormSchema}
      >
        <div
          className={`${css.container} ${isEditMode ? css["container-with-close"] : ""}`}
        >
          <Form
            className={`${css.form} ${isEditMode ? css["form-with-close"] : ""}`}
          >
            {isEditMode && (
              <button type="button" className={css.closeButton}>
                <svg className={css["icon-close"]}>
                  <use href="../../img/sprite.svg#icon-x"></use>
                </svg>
              </button>
            )}

            <div className={`${css.formGroup} ${css["radio-wrapper"]}`}>
              <label className={css["radio-label"]}>
                <Field
                  type="radio"
                  name="type"
                  value="Expense"
                  className={css.radio}
                  onClick={() => setValues("Expense")}
                />
                <span className={css["circle-around"]}>
                  <span className={css.circle}></span>
                </span>
                Expense
              </label>
              <label className={css["radio-label"]}>
                <Field
                  type="radio"
                  name="type"
                  value="Income"
                  className={css.radio}
                  onClick={() => setValues("Income")}
                />
                <span className={css["circle-around"]}>
                  <span className={css.circle}></span>
                </span>
                Income
              </label>
              <ErrorMessage
                component="span"
                name="type"
                className={css.error}
              />
            </div>

            <div className={css.dateTimeGroup}>
              {/* DATE */}
              <div className={css.formGroup}>
                <label htmlFor="date" className={css.labelDate}>
                  Date
                </label>
                <Field name="date">
                  {({
                    field,
                    form,
                  }: FieldProps & { form: FormikProps<FormValues> }) => (
                    <div
                      className={`${css["input-date-time"]} ${css["input-date-tablet"]} ${isEditMode ? css["input-date-tablet-with-close"] : ""}`}
                      onClick={() => {
                        const input = document.getElementById("date");
                        input?.focus();
                      }}
                    >
                      <DatePicker
                        id="date"
                        selected={field.value || null}
                        onChange={(date: Date | null) =>
                          form.setFieldValue(field.name, date)
                        }
                        dateFormat="dd/MM/yyyy"
                        className={css["input-date"]}
                      />
                      <span className={css["modal-icon-wrapper-date"]}>
                        <svg className={css["modal-icon-date"]}>
                          <use href="../../img/sprite.svg#icon-calendar"></use>
                        </svg>
                      </span>
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  component="span"
                  name="date"
                  className={css.error}
                />
              </div>

              {/* TIME */}
              <div className={css.formGroup}>
                <label htmlFor="time" className={css.labelDate}>
                  Time
                </label>
                <Field name="time">
                  {({
                    field,
                    form,
                  }: FieldProps & { form: FormikProps<FormValues> }) => (
                    <div
                      className={`${css["input-date-time"]} ${css["input-time-tablet"]} ${isEditMode ? css["input-date-tablet-with-close"] : ""}`}
                      onClick={() => {
                        const input = document.getElementById("time");
                        input?.focus();
                      }}
                    >
                      <DatePicker
                        id="time"
                        selected={field.value || null}
                        onChange={(date: Date | null) =>
                          form.setFieldValue(field.name, date)
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        className={css["input-time"]}
                      />
                      <span className={css["modal-icon-wrapper-date"]}>
                        <svg className={css["modal-icon-date"]}>
                          <use href="../../img/sprite.svg#icon-clock"></use>
                        </svg>
                      </span>
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  component="span"
                  name="time"
                  className={css.error}
                />
              </div>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="category" className={css.labelCategory}>
                Category
              </label>
              <Field name="category">
                {({
                  field,
                  form,
                }: FieldProps & { form: FormikProps<FormValues> }) => (
                  <>
                    <input
                      {...field}
                      id="category"
                      type="text"
                      className={`${css.input} ${
                        form.errors.category && form.touched.category
                          ? css.errorInput
                          : ""
                      }`}
                      placeholder="Different"
                      readOnly
                      onClick={openModal}
                    />
                    <ErrorMessage
                      component="span"
                      name="category"
                      className={css.error}
                    />
                  </>
                )}
              </Field>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="sum" className={css.labelSum}>
                Sum
              </label>
              <Field name="sum">
                {({
                  field,
                  form,
                }: FieldProps & { form: FormikProps<FormValues> }) => (
                  <div className={css.sumWrapper}>
                    <input
                      {...field}
                      id="sum"
                      type="number"
                      className={`${css.input} ${
                        form.errors.sum && form.touched.sum
                          ? css.errorInput
                          : ""
                      }`}
                      placeholder="Enter the sum"
                    />
                    <span
                      className={`${css.currency} ${field.value ? css.filled : ""}`}
                    >
                      {data?.currency.toUpperCase() || "UAH"}
                    </span>
                  </div>
                )}
              </Field>
              <ErrorMessage component="span" name="sum" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="comment" className={css.labelComment}>
                Comment
              </label>
              <Field
                as="textarea"
                id="comment"
                name="comment"
                rows={8}
                className={css.textarea}
                placeholder={"Enter the text"}
              />
              <ErrorMessage
                component="span"
                name="comment"
                className={css.error}
              />
            </div>

            <div className={css.actions}>
              <button type="submit" className={css.submitEditButton}>
                {isEditMode ? "Send" : "Add"}
              </button>
            </div>
          </Form>
        </div>
      </Formik>
      {isModalOpen && (
        <CategoriesModal
          categories={data?.categories}
          type={values}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default TransactionForm;
