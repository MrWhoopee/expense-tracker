"use client";

import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./TransactionsSearchTools.module.css";
import Image from "next/image";
import CustomDatePicker from "../ui/CustomDatePicker";
// import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchFormValues {
  search: string;
  date: Date | null;
}

const validationSchema = Yup.object({
  search: Yup.string(),
  date: Yup.date().nullable(),
});

const TransactionsSearchTools = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialValues: SearchFormValues = {
    search: searchParams.get("search") || "",
    date: searchParams.get("date") ? new Date(searchParams.get("date")!) : null,
  };

  const handleSubmit = (values: SearchFormValues) => {
    const params = new URLSearchParams(searchParams.toString());

    if (values.search) params.set("search", values.search);
    else params.delete("search");

    // YYYY-MM-DD for URL
    if (values.date) {
      const yyyy = values.date.getFullYear();
      const mm = String(values.date.getMonth() + 1).padStart(2, "0");
      const dd = String(values.date.getDate()).padStart(2, "0");
      params.set("date", `${yyyy}-${mm}-${dd}`);
    } else {
      params.delete("date");
    }

    router.push(`${pathname}?${params.toString()}`);
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
