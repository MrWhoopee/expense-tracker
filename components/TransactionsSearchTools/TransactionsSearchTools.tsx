"use client";

import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./TransactionsSearchTools.module.css";
import Image from "next/image";
import CustomDatePicker from "../ui/CustomDatePicker";
// import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

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

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // nothing breaks with 1-2 characters anymore
    if (value.length >= 3) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, 700); // delay

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => {}}
      validateOnChange={false} // no spam validation
      validateOnBlur={false} // to not block DatePicker's onBlur
    >
      {({ values, setFieldValue }) => (
        <Form className={css.form}>
          <div className={css.searchInputWrapper}>
            <Field
              name="search"
              minLength={3}
              maxLength={24}
              type="text"
              placeholder="Search for anything..."
              className={css.searchInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setFieldValue("search", value);
                debouncedSearch(value);
              }}
            />
            <div className={css.searchSvgContainer}>
              <Image src="/search.svg" alt="search" width={20} height={20} />
            </div>
          </div>

          <CustomDatePicker
            values={values.date}
            setFieldValue={(field, value) => {
              setFieldValue(field, value);
              const params = new URLSearchParams(searchParams.toString());
              if (value) {
                const yyyy = value.getFullYear();
                const mm = String(value.getMonth() + 1).padStart(2, "0");
                const dd = String(value.getDate()).padStart(2, "0");

                params.set("date", `${yyyy}-${mm}-${dd}`); // local date
              } else {
                params.delete("date");
              }
              router.push(`${pathname}?${params.toString()}`);
            }}
            submitForm={() => {}}
          />
        </Form>
      )}
    </Formik>
  );
};

export default TransactionsSearchTools;
