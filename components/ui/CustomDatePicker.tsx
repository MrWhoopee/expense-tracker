"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { PatternFormat } from "react-number-format";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { format, isValid, parse, isAfter } from "date-fns";
import css from "./CustomDatePicker.module.css";
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
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (values && isValid(values)) {
      setInputText(format(values, "dd/MM/yyyy"));
    } else if (!values) {
      setInputText("");
    }
  }, [values]);

  const handleComplete = (val: string) => {
    const parsed = parse(val, "dd/MM/yyyy", new Date());

    if (isValid(parsed)) {
      if (isAfter(parsed, new Date())) {
        toast.error("Date cannot be in the future", { id: "error" });
        return;
      }
      setFieldValue("date", parsed);
      setTimeout(() => submitForm(), 50);
    }
  };

  return (
    <div className={css.datePickerWrapper}>
      <DatePicker
        selected={values}
        onChange={(date: Date | null) => {
          setFieldValue("date", date);
          if (date) setTimeout(() => submitForm(), 50);
        }}
        customInput={
          <PatternFormat
            format="##/##/####"
            mask="_"
            value={inputText}
            onValueChange={(values) => {
              const { formattedValue, value } = values;
              setInputText(formattedValue);

              if (value.length === 8) {
                handleComplete(formattedValue);
              }
              if (value.length === 0) {
                setFieldValue("date", null);
                setTimeout(() => submitForm(), 50);
              }
            }}
            className={css.dateInput}
            placeholder="dd/mm/yyyy"
          />
        }
        popperModifiers={[offset(4)]}
        placeholderText="dd/mm/yyyy"
        dateFormat="dd/MM/yyyy"
        showPopperArrow={false}
        calendarStartDay={1}
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
