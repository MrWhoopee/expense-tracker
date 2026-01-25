"use client";

import React from "react";
import Image from "next/image";
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
        <Image src="/calendar.svg" alt="calendar" width={20} height={20} />
      </div>
    </div>
  );
};

export default CustomDatePicker;
