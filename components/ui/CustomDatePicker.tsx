"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import css from "./CustomDatePicker.module.css";
import toast from "react-hot-toast";
import { offset } from "@floating-ui/dom";

interface CustomDatePickerProps {
  values: Date | null;
  setFieldValue: (field: string, value: Date | null) => void;
  submitForm: () => void;
}

const CustomDatePicker = ({
  values,
  setFieldValue,
  submitForm,
}: CustomDatePickerProps) => {
  return (
    <div className={css.datePickerWrapper}>
      <DatePicker
        selected={values}
        onChange={(date: Date | null) => {
          if (date && date > new Date()) {
            toast.error("Date cannot be in the future", {
              id: "date-limit",
            });
            return;
          }
          setFieldValue("date", date);
        }}
        // onChange={(date: Date | null) => {
        //   setFieldValue("date", date);
        // }}
        onChangeRaw={(
          event?:
            | React.MouseEvent<HTMLElement, MouseEvent>
            | React.KeyboardEvent<HTMLElement>,
        ) => {
          const input = event?.target as HTMLInputElement;
          if (!input || !input.value) return;

          // replace .,-_\ with "/"
          let value = input.value.replace(/[.,\-_\\ ]/g, "/");

          // only allow numbers and "/"
          value = value.replace(/[^\d/]/g, "");

          // only 8 digits + 2 "/" allowed
          // added id to just show it once
          if (value.length > 10) {
            value = value.substring(0, 10);
            toast.error("Maximum 8 digits allowed", {
              id: "digits-limit",
            });
          }

          input.value = value;
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;

          if (!inputValue) {
            setFieldValue("date", null);
            submitForm();
            return;
          }

          // !doesn't work
          //   const isCorrectLength = inputValue.length === 10;
          //   const dateRegex =
          //     /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
          //   const isFormatValid = dateRegex.test(inputValue);
          //   const isDateValid = values.date && !isNaN(values.date.getTime());

          //   if (!isCorrectLength || !isFormatValid || !isDateValid) {
          //     toast.error("Invalid date or format (dd/mm/yyyy)", {
          //       id: "format-error",
          //     });
          //     setFieldValue("date", null);
          //     e.target.value = "";
          //   } else {
          //     submitForm();
          //   }

          submitForm();
        }}
        popperModifiers={[offset(4)]} // space between input & calendar
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/yyyy"
        //   maxDate={new Date()}
        className={css.dateInput}
        showPopperArrow={false}
        autoComplete="off"
        calendarStartDay={1}
        // timeZone="UTC"
        // locale="uk-UA"
        previousMonthButtonLabel={
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={css.arrowLeft}
          >
            <path
              d="M5 1L1 5L5 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        nextMonthButtonLabel={
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={css.arrowRight}
          >
            <path
              d="M1 9L5 5L1 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />

      <div className={css.calendarSvgContainer}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      </div>
    </div>
  );
};

export default CustomDatePicker;
