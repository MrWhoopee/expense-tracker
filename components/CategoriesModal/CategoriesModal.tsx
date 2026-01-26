"use client";

import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikValues,
} from "formik";
import css from "./CategoriesModal.module.css";
import * as Yup from "yup";
import { Category } from "@/type/category";
import { createPortal } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/clientApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { FormikProps } from "formik";
import Loader from "../Loader/Loader";
import { useTransactionStore } from "@/store/useTransactionStore";

interface UserCategory {
  type: string;
  categoryName: string;
}

interface UpdateCategory {
  _id: string;
  categoryName: string;
}

interface CategoriesModalProps {
  type: "Expense" | "Income";
  closeModal: () => void;
  setCategory: (name: string) => void;
  setCategoryId: Dispatch<SetStateAction<string>>;
  isModalOpen: boolean;
}

const CategoriesModal = ({
  type,
  closeModal,
  setCategory,
  setCategoryId,
  isModalOpen,
}: CategoriesModalProps) => {
  const queryClient = useQueryClient();
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const [currentEditId, setCurrentEditId] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);
  const draftCategoryId = useTransactionStore((s) => s.draftCategoryId);
  const setDraftCategoryId = useTransactionStore((s) => s.setDraftCategoryId);
  const clearDraftCategoryId = useTransactionStore(
    (s) => s.clearDraftCategoryId,
  );

  const { data, error, isLoading } = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(),
    refetchOnMount: false,
  });
  const categories = type === "Expense" ? data?.expenses : data?.incomes;
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = (id: string) => {
    if (currentEditId === id) {
      clearEdit();
    } else {
      setCurrentEditId(id);
      setIsEditMode(true);
      const selectedCategory = categories?.find((x) => x._id === id);
      const selectedCategoryName = selectedCategory?.categoryName;
      if (formikRef.current) {
        formikRef.current.setFieldValue(
          "newNameCategory",
          selectedCategoryName,
        );
      }
    }
  };
  const clearEdit = () => {
    setCurrentEditId("");
    setIsEditMode(false);
    if (formikRef.current) {
      formikRef.current.setFieldValue("newNameCategory", "");
    }
  };

  // * MUTATIONS
  const createCategoryMutation = useMutation({
    mutationKey: ["addNewCategory"],
    mutationFn: (params: UserCategory) => createCategory(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: (params: UpdateCategory) => updateCategory(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategories"] });
    },
  });
  //* MUTATIONS END

  //& CATEGORIES HANDLES
  const handleSubmit = async (formData: FormikValues) => {
    setIsLoader(true);
    const categoryType = type === "Expense" ? "expenses" : "incomes";
    const newNameCategory = formData?.newNameCategory;

    if (!isEditMode) {
      const createCategoryParams = {
        type: categoryType,
        categoryName: newNameCategory,
      };

      try {
        createCategoryMutation.mutate(createCategoryParams);
      } catch (error) {
        console.log(error);
      } finally {
        clearEdit();
        setIsLoader(false);
      }
    } else {
      const updateCategoryParams = {
        _id: currentEditId,
        categoryName: newNameCategory,
      };

      try {
        updateCategoryMutation.mutate(updateCategoryParams);
      } catch (error) {
        console.log(error);
      } finally {
        clearEdit();
        setIsLoader(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    try {
      setIsLoader(true);
      deleteCategoryMutation.mutate(id);
    } catch (error) {
      console.log(error);
    } finally {
      clearEdit();
      setIsLoader(false);
    }
  };
  //& CATEGORIES HANDLES END

  const initialValues = {
    newNameCategory: "",
  };

  const FormSchema = Yup.object().shape({
    newNameCategory: Yup.string().min(2, "Min 2 chars").max(16, "Max 16 chars"),
  });

  useEffect(() => {
    if (isModalOpen && categories?.length && firstFocusRef.current) {
      firstFocusRef.current.focus();
    }
  }, [isModalOpen, categories]);

  //? FOR MODAL
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

  //? FOR MODAL END

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {isLoading || isLoader ? (
        <Loader />
      ) : (
        <div className={css.modal}>
          {/* BUTTON CLOSE */}
          <button
            type="button"
            className={css.closeButton}
            onClick={closeModal}
            aria-label="Close modal"
          >
            <svg className={css["icon-close"]}>
              <use href="/img/sprite.svg#icon-x"></use>
            </svg>
          </button>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={FormSchema}
            innerRef={formikRef}
          >
            <Form className={css.form}>
              <div className={css.formGroup}>
                <div className={css["container-item"]}>
                  {/* TITTLE */}
                  <h3 className={css.formCategoryTitle}>
                    {type === "Income" ? "Incomes" : "Expenses"}
                  </h3>
                  {/* PARAGRAPH */}
                  <p className={css.allCategory}>All category</p>
                </div>

                {/* CATEGORIES */}
                {!categories ? (
                  <p
                    className={`${css.emptyCategoryList} ${css["container-item"]}`}
                  >
                    You don&apos;t have any categories, you can add some now.
                  </p>
                ) : (
                  <ul className={css.categoryList}>
                    {categories?.map((cat, index) => (
                      <li className={css.categoryItem} key={cat._id}>
                        <p className={css.categoryText}>{cat.categoryName}</p>

                        <div className={css.buttonWrapper}>
                          <button
                            type="button"
                            className={css.buttonModal}
                            onClick={() => {
                              setCategory(cat.categoryName);
                              setCategoryId(cat._id);
                              setDraftCategoryId(cat._id);
                            }}
                            ref={index === 0 ? firstFocusRef : null}
                            aria-label={`Select category ${cat.categoryName}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="/img/sprite.svg#icon-check"></use>
                            </svg>
                          </button>

                          <button
                            type="button"
                            className={css.buttonModal}
                            onClick={() => toggleEditMode(cat._id)}
                            aria-label={`Edit category ${cat.categoryName}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="/img/sprite.svg#icon-edit"></use>
                            </svg>
                          </button>

                          <button
                            type="button"
                            className={css.buttonModal}
                            onClick={() => handleDelete(cat._id)}
                            aria-label={`Delete category ${cat.categoryName}`}
                          >
                            <svg
                              width="16"
                              height="16"
                              className={css.iconModal}
                            >
                              <use href="/img/sprite.svg#icon-trash"></use>
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <ErrorMessage
                  component="span"
                  name="category"
                  className={css.error}
                />
              </div>

              {/* NEW CATEGORY */}
              <div className={`${css["container-item"]} ${css.formGroup}`}>
                <label
                  className={css.newCategoryLabel}
                  htmlFor="newNameCategory"
                >
                  {!isEditMode ? "New Category" : "Edit Category"}
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
                        aria-invalid={!!meta.error}
                        aria-describedby={
                          meta.error ? "newNameCategory-error" : undefined
                        }
                      />

                      <button type="submit" className={css.buttonAddEdit}>
                        {!isEditMode ? "Add" : "Edit"}
                      </button>
                    </div>
                  )}
                </Field>

                <div className={css.errorPlaceholder}>
                  <ErrorMessage
                    component="span"
                    id="newNameCategory-error"
                    name="newNameCategory"
                    className={css.error}
                  />
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </div>,
    document.body,
  );
};

export default CategoriesModal;
