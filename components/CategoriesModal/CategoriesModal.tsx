"use client";

import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import css from "./CategoriesModal.module.css";
import * as Yup from "yup";
import { Expenses, Income } from "@/type/category";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface Categories {
  incomes: Income[];
  expenses: Expenses[];
}

interface CategoriesModalProps {
  categories: Categories | undefined;
  type: "Expense" | "Income";
  closeModal: () => void;
}

const CategoriesModal = ({
  categories,
  type,
  closeModal,
}: CategoriesModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleDelete = (id: string) => {
    console.log(`hello ${id}`);
  };

  const handleSubmit = () => console.log("hello");

  const initialValues = {
    category:
      type === "Income"
        ? categories?.incomes.length !== 0
          ? categories?.incomes[0]
          : "You don't have income categories"
        : categories?.expenses.length !== 0
          ? categories?.expenses[0]
          : "You don't have expense categories",
    newNameCategory: "",
  };

  const FormSchema = Yup.object().shape({
    newNameCategory: Yup.string().min(2, "Min 2 chars").max(16, "Max 16 chars"),
  });

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeModal]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button type="button" className={css.closeButton} onClick={closeModal}>
          <svg className={css["icon-close"]}>
            <use href="../../img/sprite.svg#icon-x"></use>
          </svg>
        </button>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={FormSchema}
        >
          <Form className={css.form}>
            <div className={css.formGroup}>
              <div className={css["container-item"]}>
                <h3 className={css.formCategoryTitle}>
                  {type === "Income" ? "Incomes" : "Expenses"}
                </h3>
                <p className={css.allCategory}>All category</p>
              </div>

              <ul className={css.categoryList}>
                {type === "Income"
                  ? categories?.incomes?.map((cat) => (
                      <li
                        className={`${css.categoryItem} ${css.containerBig}`}
                        key={cat._id}
                      >
                        <label
                          htmlFor="newNameCategory"
                          className={css.categoryLabel}
                        >
                          <Field
                            id="newNameCategory"
                            type="radio"
                            name="category"
                            value={cat.categoryName}
                          />
                          {cat.categoryName}
                        </label>
                        <div className={css.buttonWrapper}>
                          <button type="button" className={css.buttonModal}>
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="../../img/sprite.svg#icon-check"></use>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className={css.buttonModal}
                            onClick={toggleEditMode}
                          >
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="../../img/sprite.svg#icon-edit"></use>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className={css.buttonModal}
                            onClick={() => handleDelete(cat._id)}
                          >
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="../../img/sprite.svg#icon-trash"></use>
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))
                  : categories?.expenses?.map((cat) => (
                      <li className={css.categoryItem} key={cat._id}>
                        <label
                          htmlFor="newNameCategory"
                          className={css.categoryLabel}
                        >
                          <Field
                            id="newNameCategory"
                            type="radio"
                            name="category"
                            value={cat.categoryName}
                          />
                          {cat.categoryName}
                        </label>
                        <div className={css.buttonWrapper}>
                          <button type="button" className={css.buttonModal}>
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="../../img/sprite.svg#icon-check"></use>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className={css.buttonModal}
                            onClick={toggleEditMode}
                          >
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="../../img/sprite.svg#icon-edit"></use>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className={css.buttonModal}
                            onClick={() => handleDelete(cat._id)}
                          >
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="../../img/sprite.svg#icon-trash"></use>
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
              </ul>
              <ErrorMessage
                component="span"
                name="category"
                className={css.error}
              />
            </div>

            <div className={`${css["container-item"]} ${css.formGroup}`}>
              <label className={css.newCategoryLabel} htmlFor="newNameCategory">
                New Category
              </label>

              <Field name="newNameCategory">
                {({ field, meta }: FieldProps) => (
                  <div className={css.inputButtonWrapper}>
                    <input
                      {...field}
                      id="newNameCategory"
                      type="text"
                      placeholder="Enter the text"
                      className={`${css.input} ${
                        meta.touched && meta.error ? css.errorInput : ""
                      }`}
                    />

                    <button type="submit" className={css.buttonAddEdit}>
                      {!isEditMode ? "Add" : "Edit"}
                    </button>
                  </div>
                )}
              </Field>

              <ErrorMessage
                component="span"
                name="newNameCategory"
                className={css.error}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>,
    document.body,
  );
};

export default CategoriesModal;
