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
import { useEffect, useRef, useState } from "react";
import CategoriesModal from "../CategoriesModal/CategoriesModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { createTransaction } from "@/lib/clientApi";
import { useTransactionStore } from "@/store/useTransactionStore";
import { getYear, getMonth } from "date-fns";
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// import { createTransaction2, getUser } from "@/lib/clientApi";

type TransactionType = "Expense" | "Income";

export interface FormValues {
  type: TransactionType;
  date: Date | string;
  time: Date | string;
  category: string;
  sum: string | number;
  comment: string;
}

interface CreateTransaction {
  type: string;
  date: string;
  time: string;
  category: string;
  sum: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useUserStore((s) => s.user);
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const transactionDraft = useTransactionStore((s) => s.transactionDraft);
  const setTransactionDraft = useTransactionStore((s) => s.setTransactionDraft);
  const clearTransactionDraft = useTransactionStore(
    (s) => s.clearTransactionDraft,
  );

  const draftCategoryId = useTransactionStore((s) => s.draftCategoryId);
  useTransactionStore((s) => s.setDraftCategoryId);
  const clearDraftCategoryId = useTransactionStore(
    (s) => s.clearDraftCategoryId,
  );
  const [categoryId, setCategoryId] = useState(draftCategoryId);

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["getUserCurrent"],
  //   queryFn: () => getUser(),
  //   refetchOnMount: false,
  // });

  // const isEditMode = !!transactionData;
  const isEditMode = false;

  let initialValues = getInitialValues(transactionData);

  if (transactionData == null) {
    initialValues = {
      type: transactionDraft?.type === "Income" ? "Income" : "Expense",
      date: transactionDraft?.date ?? new Date(),
      time: transactionDraft?.time ?? new Date(),
      category: transactionDraft?.category ?? "",
      sum: transactionDraft?.sum ?? "",
      comment: transactionDraft?.comment ?? "",
    };
  }

  const queryClient = useQueryClient();

  //* MUTATIONS
  const createTransactionMutation = useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: (params: CreateTransaction) => createTransaction(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTransactions"] });
      clearTransactionDraft();
    },
  });
  //* MUTATIONS END

  const clearFormikForm = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  const handleSubmit = (formData: FormValues) => {
    try {
      const params = {
        type: formData.type === "Expense" ? "expenses" : "incomes",
        date: formData.date?.toString().split("T")[0],
        time: new Date(formData.time?.toString()).toTimeString().slice(0, 5),
        category: categoryId,
        sum: Number.parseInt(formData.sum.toString()),
        comment: formData.comment,
      };
      debugger;

      console.log(JSON.stringify(params));

      createTransactionMutation.mutate(params);
      clearTransactionDraft();
      clearFormikForm();
      clearDraftCategoryId();
    } catch (error) {
      console.log(error);
    }
  };

  const data2 = {
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

  const FormSchema = Yup.object().shape({
    type: Yup.mixed<TransactionType>()
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
    if (formikRef.current) {
      formikRef.current.setFieldValue("category", "");
    }
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      lastFocusedRef.current?.focus();
    }
  }, [isModalOpen]);

  const updateTransactionDraftFromEvent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!formikRef.current) return;

    setTransactionDraft({
      ...formikRef.current.values,
      [e.target.name]: e.target.value,
    });
  };

  const clearCategoryInput = () => {
    setCategoryId("");
    clearDraftCategoryId();
    if (formikRef.current) {
      formikRef.current.setFieldValue("category", "");
    }
  };

  return (
    <div
      className={`${css["transaction-form-wrapper"]} ${isEditMode ? css["transaction-form-wrapper-with-close"] : ""}`}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={FormSchema}
        innerRef={formikRef}
      >
        {({ handleChange, values, setFieldValue }) => (
          <>
            <div
              className={`${css.container} ${isEditMode ? css["container-with-close"] : ""}`}
            >
              <Form
                className={`${css.form} ${isEditMode ? css["form-with-close"] : ""}`}
              >
                {/* CLOSE BUTTON */}
                {isEditMode && (
                  <button
                    type="button"
                    className={css.closeButton}
                    aria-label="Close modal"
                  >
                    <svg className={css["icon-close"]}>
                      <use href="../../img/sprite.svg#icon-x"></use>
                    </svg>
                  </button>
                )}

                {/* RADIO BUTTONS */}
                <div
                  className={`${css.formGroup} ${css["radio-wrapper"]}`}
                  aria-label="Transaction type"
                  aria-describedby="type-error"
                >
                  <label className={css["radio-label"]}>
                    <Field
                      type="radio"
                      name="type"
                      value="Expense"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        clearCategoryInput();
                        setTimeout(() => updateTransactionDraftFromEvent(e), 0);
                      }}
                      className={css.radio}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        clearCategoryInput();
                        setTimeout(() => updateTransactionDraftFromEvent(e), 0);
                      }}
                      className={css.radio}
                    />
                    <span className={css["circle-around"]}>
                      <span className={css.circle}></span>
                    </span>
                    Income
                  </label>
                  <div className={css.errorPlaceholder}>
                    <ErrorMessage
                      component="span"
                      name="type"
                      className={css.error}
                      id="type-error"
                    />
                  </div>
                </div>

                {/* DATE AND TIME */}
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
                            aria-label="Transaction date"
                            aria-describedby="date-error"
                            selected={field.value || null}
                            onChange={(date: Date | null) => {
                              form.setFieldValue(field.name, date);
                              setTransactionDraft({
                                ...formikRef.current!.values,
                                date,
                              });
                            }}
                            dateFormat="dd/MM/yyyy"
                            className={css["input-date"]}
                            calendarClassName="transaction-calendar-for-transaction-form"
                            renderCustomHeader={({
                              date,
                              decreaseMonth,
                              increaseMonth,
                              prevMonthButtonDisabled,
                              nextMonthButtonDisabled,
                            }) => (
                              <div
                                className={
                                  css["transaction-calendar-for-form-header"]
                                }
                              >
                                <button
                                  type="button"
                                  className={css["button-calendar"]}
                                  onClick={decreaseMonth}
                                  disabled={prevMonthButtonDisabled}
                                >
                                  <svg
                                    width="6"
                                    height="10"
                                    viewBox="0 0 6 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={css["icon-arrow"]}
                                  >
                                    <path
                                      d="M5 1L1 5L5 9"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                                <p className={css["calendar-title"]}>
                                  {MONTHS[getMonth(date)] + " " + getYear(date)}
                                </p>
                                <button
                                  type="button"
                                  className={css["button-calendar"]}
                                  onClick={increaseMonth}
                                  disabled={nextMonthButtonDisabled}
                                >
                                  <svg
                                    width="6"
                                    height="10"
                                    viewBox="0 0 6 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={css["icon-arrow"]}
                                  >
                                    <path
                                      d="M1 9L5 5L1 1"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          />
                          <span className={css["modal-icon-wrapper-date"]}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={css["modal-icon-date"]}
                            >
                              <path
                                d="M15.8333 3.33337H4.16667C3.24619 3.33337 2.5 4.07957 2.5 5.00004V16.6667C2.5 17.5872 3.24619 18.3334 4.16667 18.3334H15.8333C16.7538 18.3334 17.5 17.5872 17.5 16.6667V5.00004C17.5 4.07957 16.7538 3.33337 15.8333 3.33337Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M13.3333 1.66663V4.99996"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6.66675 1.66663V4.99996"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2.5 8.33337H17.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      )}
                    </Field>
                    <div className={css.errorPlaceholder}>
                      <ErrorMessage
                        component="span"
                        name="date"
                        className={css.error}
                        id="date-error"
                      />
                    </div>
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
                            aria-label="Transaction date"
                            aria-describedby="time-error"
                            selected={field.value || null}
                            onChange={(date: Date | null) => {
                              form.setFieldValue(field.name, date);
                              setTransactionDraft({
                                ...formikRef.current!.values,
                                time: date,
                              });
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            className={css["input-time"]}
                            calendarClassName="transaction-time-for-transaction-form"
                            timeClassName={() =>
                              "transaction-calendar-time-for-transaction-form"
                            }
                          />
                          <span className={css["modal-icon-wrapper-date"]}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={css["modal-icon-date"]}
                            >
                              <path
                                d="M10 5.83337V10L12.5 11.25"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.3333 10C18.3333 14.6024 14.6024 18.3334 10 18.3334C5.39763 18.3334 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66663 10 1.66663C14.6024 1.66663 18.3333 5.39763 18.3333 10Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      )}
                    </Field>
                    <ErrorMessage
                      component="span"
                      name="time"
                      className={css.error}
                      id="time-error"
                    />
                  </div>
                </div>

                {/* CATEGORY */}
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
                          aria-label="Transaction category"
                          aria-haspopup="dialog"
                          aria-describedby="category-error"
                          className={`${css.input} ${
                            isModalOpen ? css.activeInput : ""
                          } ${
                            form.errors.category &&
                            form.touched.category &&
                            !isModalOpen
                              ? css.errorInput
                              : ""
                          }`}
                          placeholder="Different"
                          readOnly
                          onClick={() => {
                            form.setFieldTouched("category", false);
                            openModal();
                          }}
                          onFocus={() => {
                            form.setFieldTouched("category", false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openModal();
                            }
                          }}
                        />

                        <div className={css.errorPlaceholder}>
                          {!isModalOpen && (
                            <ErrorMessage
                              name="category"
                              component="span"
                              className={css.error}
                              id="category-error"
                            />
                          )}
                        </div>
                      </>
                    )}
                  </Field>
                </div>

                {/* SUM */}
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
                          aria-label="Transaction sum"
                          aria-describedby="sum-error"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            handleChange(e);
                            updateTransactionDraftFromEvent(e);
                          }}
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
                          {data2?.currency.toUpperCase() || "UAH"}
                        </span>
                      </div>
                    )}
                  </Field>
                  <div className={css.errorPlaceholder}>
                    <ErrorMessage
                      component="span"
                      name="sum"
                      className={css.error}
                      id="sum-error"
                    />
                  </div>
                </div>

                {/* COMMENT */}
                <div className={css.formGroup}>
                  <label htmlFor="comment" className={css.labelComment}>
                    Comment
                  </label>

                  <Field name="comment">
                    {({
                      field,
                      form,
                    }: FieldProps & { form: FormikProps<FormValues> }) => (
                      <textarea
                        {...field}
                        id="comment"
                        aria-label="Transaction comment"
                        aria-describedby="comment-error"
                        rows={8}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>,
                        ) => {
                          handleChange(e);
                          updateTransactionDraftFromEvent(e);
                        }}
                        className={`${css.textarea} ${
                          form.errors.comment && form.touched.comment
                            ? css.errorInput
                            : ""
                        }`}
                        placeholder="Enter the text"
                      />
                    )}
                  </Field>

                  <div className={css.errorPlaceholder}>
                    <ErrorMessage
                      component="span"
                      name="comment"
                      className={css.error}
                      id="comment-error"
                    />
                  </div>
                </div>

                {/* SEND/ADD BUTTON */}
                <div className={css.actions}>
                  <button type="submit" className={css.submitEditButton}>
                    {isEditMode ? "Send" : "Add"}
                  </button>
                </div>
              </Form>
            </div>

            {/* MODAL */}
            {isModalOpen && (
              <CategoriesModal
                type={values.type}
                closeModal={closeModal}
                setCategory={(name: string) => {
                  setFieldValue("category", name);
                  setTransactionDraft({
                    ...formikRef.current!.values,
                    ["category"]: name,
                  });
                  closeModal();
                }}
                setCategoryId={setCategoryId}
                isModalOpen
              />
            )}
          </>
        )}
      </Formik>
    </div>
  );
};

export default TransactionForm;
