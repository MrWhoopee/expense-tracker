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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CategoriesModal from "../CategoriesModal/CategoriesModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import {
  createTransaction,
  getCategories,
  updateTransaction,
} from "@/lib/clientApi";
import { useTransactionStore } from "@/store/useTransactionStore";
import { getYear, getMonth } from "date-fns";
import toast from "react-hot-toast";
import axios, { AxiosError, AxiosResponse } from "axios";
import { NextResponse } from "next/server";
import Modal from "../Modal/Modal";
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

type TransactionType = "Expense" | "Income" | string;

export interface FormValues {
  _id?: string | null;
  type: TransactionType | string;
  date: Date | string | null;
  time: Date | string | null;
  category: string;
  sum: string | number;
  comment?: string;
}

interface CreateTransaction {
  type: string;
  date: string;
  time: string;
  category: string;
  sum: number;
  comment?: string;
}

interface UpdateTransaction {
  date: string;
  time: string;
  category: string;
  sum: number;
  comment?: string;
}

type UpdateTransactionVars = {
  type: string;
  id: string;
  body: UpdateTransaction;
};

interface TransactionFormProps {
  transactionData?: FormValues;
}

export interface Transaction {
  _id: string;
  type: string;
  date: string;
  time: string;
  category: {
    _id: string;
    categoryName: string;
  };
  sum: number;
  comment: string;
}

const tempTransactionData = (): Transaction => {
  return {
    _id: "6977ab98f65c9e355471078e",
    category: {
      _id: "6977a2a0f65c9e35547103e3",
      categoryName: "666",
    },
    comment: "7772",
    date: "2026-01-26",
    sum: 5656,
    time: "19:58",
    type: "expenses",
  };
};

interface Props {
  transaction?: Transaction | null;
  closeTransactionModal?: () => void;
}

const TransactionForm = ({ transaction, closeTransactionModal }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [isLoader, setIsLoader] = useState(false);

  const userData = useUserStore((s) => s.user);
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const transactionDraft = useTransactionStore((s) => s.transactionDraft);
  const setTransactionDraft = useTransactionStore((s) => s.setTransactionDraft);
  const clearTransactionDraft = useTransactionStore(
    (s) => s.clearTransactionDraft,
  );

  const draftCategoryId = useTransactionStore((s) => s.draftCategoryId);
  const setDraftCategoryId = useTransactionStore((s) => s.setDraftCategoryId);
  const clearDraftCategoryId = useTransactionStore(
    (s) => s.clearDraftCategoryId,
  );

  const isEditMode = !!transaction;

  const disableExpense = Boolean(transaction?.type === "incomes");

  // const isEditMode = false;
  // const isEditMode = true;

  const setFormikForm = (transactionData: FormValues) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue("sum", transactionData.sum);
      formikRef.current.setFieldValue("type", transactionData.type);
      formikRef.current.setFieldValue("date", transactionData.date);
      formikRef.current.setFieldValue("time", transactionData.time);
      formikRef.current.setFieldValue("category", transactionData.category);
      formikRef.current.setFieldValue("comment", transactionData.comment);
    }
  };

  useLayoutEffect(() => {
    let transactionData: FormValues = {
      _id: null,
      type: "Expense",
      date: new Date(),
      time: new Date(),
      category: "",
      sum: "",
      comment: "",
    };

    // transaction = tempTransactionData();
    if (transaction) {
      transactionData = {
        _id: transaction._id,
        type: transaction.type === "incomes" ? "Income" : "Expense",
        date: new Date(transaction.date),
        time: new Date(`${transaction.date}T${transaction.time}`),
        category: transaction.category.categoryName,
        sum: transaction.sum,
        comment: transaction.comment,
      };

      setFormikForm(transactionData);
      setTransactionDraft(transactionData);
      setDraftCategoryId(transaction.category._id);
    }
  }, [transaction, setTransactionDraft, setDraftCategoryId]);

  const queryClient = useQueryClient();

  //* MUTATIONS
  const createTransactionMutation = useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: (params: CreateTransaction) => createTransaction(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user-info"] });

      clearTransactionDraft();
      toast.success("Transaction created successfully");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.response.message);
      }
    },
  });

  const editTransactionMutation = useMutation({
    mutationKey: ["updateTransaction"],
    mutationFn: ({ type, id, body }: UpdateTransactionVars) =>
      updateTransaction(type, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      clearTransactionDraft();
      toast.success("Transaction updated");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.response.message);
      }
    },
  });
  //* MUTATIONS END

  const clearFormikForm = () => {
    if (formikRef.current) {
      formikRef.current.setFieldValue("sum", "");
      formikRef.current.setFieldValue("type", "Expense");
      formikRef.current.setFieldValue("date", new Date());
      formikRef.current.setFieldValue("time", new Date());
      formikRef.current.setFieldValue("category", "");
      formikRef.current.setFieldValue("comment", "");
    }
  };

  const handleSubmit = (formData: FormValues) => {
    try {
      setIsLoader(true);
      if (!isEditMode) {
        const params = {
          type: formData.type === "Expense" ? "expenses" : "incomes",
          date: new Date(formData.date?.toString() ?? "")
            .toISOString()
            .split("T")[0],
          time: new Date(formData.time?.toString() ?? "")
            .toTimeString()
            .slice(0, 5),
          category: draftCategoryId,
          sum: Number.parseInt(formData.sum.toString()),
          comment: (formData?.comment ?? "").trim(),
        };

        createTransactionMutation.mutate(params);
        clearFormikForm();
        clearTransactionDraft();
        clearDraftCategoryId();
        setIsLoader(false);
      } else {
        const editParams: UpdateTransactionVars = {
          type: formData.type === "Expense" ? "expenses" : "incomes",
          id: transaction._id ?? "",
          body: {
            category: draftCategoryId,
            date: new Date(formData.date?.toString() ?? "")
              .toISOString()
              .split("T")[0],
            time: new Date(formData.time?.toString() ?? "")
              .toTimeString()
              .slice(0, 5),
            sum: Number.parseInt(formData.sum.toString()),
            comment: (formData?.comment ?? "").trim(),
          },
        };

        editTransactionMutation.mutate(editParams);
        setIsLoader(false);
        if (closeTransactionModal) closeTransactionModal();
      }
    } catch (error) {
      console.log(error);
    }
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
    comment: Yup.string()
      .min(3, "Min 3 chars")
      .max(48, "Max 48 chars")
      .required("Comment is required"),
  });

  const openModal = () => {
    clearCategoryInput();
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
    setDraftCategoryId("");
    clearDraftCategoryId();
    setTransactionDraft({
      ...transactionDraft,
      ["category"]: "",
    });
    if (formikRef.current) {
      formikRef.current.setFieldValue("category", "");
    }
  };

  return (
    <div
      className={`${css["transaction-form-wrapper"]} ${isEditMode ? css["transaction-form-wrapper-with-close"] : ""}`}
    >
      {/* <button onClick={handleModalOpen}>Open Modal</button> */}

      <Formik
        initialValues={transactionDraft}
        onSubmit={handleSubmit}
        validationSchema={FormSchema}
        validateOnChange={false}
        validateOnBlur={false}
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
                    onClick={closeTransactionModal}
                  >
                    <svg className={css["icon-close"]}>
                      <use href="/img/sprite.svg#icon-x"></use>
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
                      disabled={isEditMode && disableExpense}
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
                      disabled={isEditMode && !disableExpense}
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    decreaseMonth();
                                  }}
                                  disabled={prevMonthButtonDisabled}
                                >
                                  <svg className={css["icon-arrow"]}>
                                    <use href="/img/sprite.svg#icon-arrow-left"></use>
                                  </svg>
                                </button>
                                <p className={css["calendar-title"]}>
                                  {MONTHS[getMonth(date)] + " " + getYear(date)}
                                </p>
                                <button
                                  type="button"
                                  className={css["button-calendar"]}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    increaseMonth();
                                  }}
                                  disabled={nextMonthButtonDisabled}
                                >
                                  <svg className={css["icon-arrow"]}>
                                    <use href="/img/sprite.svg#icon-arrow-right"></use>
                                  </svg>
                                </button>
                              </div>
                            )}
                          />
                          <span className={css["modal-icon-wrapper-date"]}>
                            <svg className={css["modal-icon-date"]}>
                              <use href="/img/sprite.svg#icon-calendar"></use>
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
                            <svg className={css["modal-icon-date"]}>
                              <use href="/img/sprite.svg#icon-clock"></use>
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
                          {userData?.currency?.toUpperCase() || "UAH"}
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
                    {isEditMode ? "Edit" : "Add"}
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
                setCategoryId={setDraftCategoryId}
                isModalOpen
              />
            )}
          </>
        )}
      </Formik>
      {/* 
      {
        openFormModal && <Modal onClose={handleModalClose}>
          <TransactionForm closeTransactionModal={handleModalClose} />
        </Modal>
      } */}
    </div>
  );
};

export default TransactionForm;
