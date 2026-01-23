"use client";

import React, { useMemo, useState } from "react";
import css from "./TransactionsList.module.css";
import {
  AllCommunityModule,
  AutoSizeStrategy,
  ColDef,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Image from "next/image";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface Transaction {
  category: string;
  comment: string;
  date: string;
  time: string;
  sum: string; //number?
  type?: "income" | "expense";
}

// buttons renderer
// type?
const ActionsRenderer = (props: any) => {
  const onEdit = () => {
    console.log("Edit transaction:", props.data);
  };

  const onDelete = () => {
    console.log("Delete transaction ID:", props.data.id);
  };

  return (
    <div className={css.actionsCell}>
      <div className={css.editButtonContainer}>
        <button onClick={onEdit} className={css.editBtn}>
          Edit
        </button>
        <div className={css.editSvgContainer}>
          <Image src="/edit.svg" alt="Edit" width={16} height={16} />
        </div>
      </div>

      <div className={css.deleteButtonContainer}>
        <button onClick={onDelete} className={css.deleteBtn}>
          Delete
        </button>
        <div className={css.deleteSvgContainer}>
          <Image src="/delete.svg" alt="Delete" width={16} height={16} />
        </div>
      </div>
    </div>
  );
};

interface Props {
  type: string;
  data: Transaction[];
}

const TransactionsList = ({ type, data }: Props) => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<Transaction[]>([
    {
      category: "type",
      comment: "Model Y",
      date: "83293293",
      time: "5:55",
      sum: "100 / UAH",
    },
    {
      category: "type",
      comment: "Model Model Model Model Model",
      date: "64950",
      time: "23:23",
      sum: "10 / UAH",
    },
    {
      category: "type",
      comment: "Model X",
      date: "64950",
      time: "23:45",
      sum: "3992399283820 / UAH",
    },
    {
      category: "gifts",
      comment: "Model T",
      date: "64950",
      time: "13:33",
      sum: "10430 / UAH",
    },
    {
      category: "fun",
      comment: "Model L",
      date: "40750",
      time: "16:07",
      sum: "2 / UAH",
    },
    {
      category: "food",
      comment: "Model N",
      date: "64950",
      time: "2:24",
      sum: "3400 / UAH",
    },
    {
      category: "type",
      comment: "Model M",
      date: "64950",
      time: "5:23",
      sum: "2300 / UAH",
    },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [columnDefs, setColumnDefs] = useState<ColDef<Transaction>[]>([
    { field: "category", headerName: "Category", minWidth: 150 },
    { field: "comment", headerName: "Comment", minWidth: 150 },
    { field: "date", headerName: "Date", minWidth: 170 },
    { field: "time", headerName: "Time", maxWidth: 100 },
    { field: "sum", headerName: "Sum", minWidth: 150 },
    {
      headerName: "Action",
      cellRenderer: ActionsRenderer,
      minWidth: 327,
      resizable: false,
      sortable: false,
      filter: false,
    },
  ]);

  const defaultColDef = {
    // flex: 1,
  };

  //   const autoSizeStrategy = useMemo<AutoSizeStrategy>(() => {
  //     return {
  //       type: "fitCellContents",
  //         defaultMaxWidth: 280,
  //         defaultMinWidth: 100,
  //     };
  //   }, []);

  const myTheme = themeQuartz.withParams({
    accentColor: "#4343453D",
    backgroundColor: "#171719",
    borderColor: "#4343453D",
    borderRadius: 0,
    browserColorScheme: "dark",
    cellHorizontalPaddingScale: 1,
    chromeBackgroundColor: {
      ref: "backgroundColor",
    },
    columnBorder: false,
    fontFamily: {
      googleFont: "Inter, sans-serif",
    },
    fontSize: 20,
    foregroundColor: "#FAFAFA",
    headerBackgroundColor: "#121214",
    headerFontFamily: {
      googleFont: "Inter, sans-serif",
    },
    headerFontSize: 16,
    headerFontWeight: 400,
    headerHeight: 60,
    headerRowBorder: false,
    headerTextColor: "#6F6F70",
    rowBorder: false,
    rowHeight: 68,
    spacing: 20,
    rowHoverColor: "#4343453D",
    rowVerticalPaddingScale: 1.2,
    sidePanelBorder: false,
    wrapperBorder: false,
    wrapperBorderRadius: 0,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "0 0 30px 0",
        borderRadius: "0",
        zIndex: "9",
      }}
    >
      <AgGridReact
        className={css.gridContainer}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        theme={myTheme}
        suppressCellFocus={true}
        suppressScrollOnNewData={false}
        // autoSizeStrategy={autoSizeStrategy}
        // suppressHorizontalScroll={false}
        // alwaysShowHorizontalScroll={true}
        // debounceVerticalScrollbar={true}
      />
    </div>
  );
};

export default TransactionsList;
