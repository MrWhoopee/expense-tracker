"use client";

import { useMemo } from "react";
import css from "./TransactionsList.module.css";
import { useTheme } from "next-themes";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  themeQuartz,
  // ValueFormatterParams,
} from "ag-grid-community";
import { ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Image from "next/image";
import { Transaction } from "@/type/transaction";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// buttons renderer
const ActionsRenderer = (props: ICellRendererParams<Transaction>) => {
  const onEdit = () => {
    console.log("Edit transaction:", props.data);
  };

  const onDelete = () => {
    console.log("Delete transaction ID:", props.data?._id);
  };

  return (
    <div className={css.actionsCell}>
      <div className={css.editButtonContainer}>
        <button tabIndex={0} onClick={onEdit} className={css.editBtn}>
          Edit
        </button>
        <div className={css.editSvgContainer}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={css.actionSvg}
          >
            <path
              d="M11.3333 2.00004C11.5083 1.82494 11.7162 1.68605 11.945 1.59129C12.1738 1.49653 12.419 1.44775 12.6666 1.44775C12.9142 1.44775 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8248 1.82494 13.9999 2.00004C14.175 2.17513 14.3139 2.383 14.4087 2.61178C14.5034 2.84055 14.5522 3.08575 14.5522 3.33337C14.5522 3.58099 14.5034 3.82619 14.4087 4.05497C14.3139 4.28374 14.175 4.49161 13.9999 4.6667L4.99992 13.6667L1.33325 14.6667L2.33325 11L11.3333 2.00004Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className={css.deleteButtonContainer}>
        <button tabIndex={0} onClick={onDelete} className={css.deleteBtn}>
          Delete
        </button>
        <div className={css.deleteSvgContainer}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={css.actionSvg}
          >
            <path
              d="M2 4H3.33333H14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6666 4.00004V13.3334C12.6666 13.687 12.5261 14.0261 12.2761 14.2762C12.026 14.5262 11.6869 14.6667 11.3333 14.6667H4.66659C4.31296 14.6667 3.97382 14.5262 3.72378 14.2762C3.47373 14.0261 3.33325 13.687 3.33325 13.3334V4.00004M5.33325 4.00004V2.66671C5.33325 2.31309 5.47373 1.97395 5.72378 1.7239C5.97383 1.47385 6.31296 1.33337 6.66659 1.33337H9.33325C9.68688 1.33337 10.026 1.47385 10.2761 1.7239C10.5261 1.97395 10.6666 2.31309 10.6666 2.66671V4.00004"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.66675 7.33337V11.3334"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.33325 7.33337V11.3334"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface TransactionsListProps {
  data: Transaction[];
}

const TransactionsList = ({ data }: TransactionsListProps) => {
  const { resolvedTheme } = useTheme();

  // Row Data: The data to be displayed.
  // const [rowData, setRowData] = useState<Transaction[]>([
  //   {
  //     _id: "1",
  //     category: "type",
  //     comment: "Model Y",
  //     date: "83293293",
  //     time: "5:55",
  //     sum: "100 / UAH",
  //   },
  //   {
  //     _id: "2",
  //     category: "type",
  //     comment: "Model Model Model Model Model",
  //     date: "64950",
  //     time: "23:23",
  //     sum: "10 / UAH",
  //   },
  //   {
  //     _id: "3",
  //     category: "type",
  //     comment: "Model X",
  //     date: "64950",
  //     time: "23:45",
  //     sum: "3992399283820 / UAH",
  //   },
  //   {
  //     _id: "4",
  //     category: "gifts",
  //     comment: "Model T",
  //     date: "64950",
  //     time: "13:33",
  //     sum: "10430 / UAH",
  //   },
  //   {
  //     _id: "5",
  //     category: "fun",
  //     comment: "Model L",
  //     date: "40750",
  //     time: "16:07",
  //     sum: "2 / UAH",
  //   },
  //   {
  //     _id: "6",
  //     category: "food",
  //     comment: "Model N",
  //     date: "64950",
  //     time: "2:24",
  //     sum: "3400 / UAH",
  //   },
  //   {
  //     _id: "7",
  //     category: "type",
  //     comment: "Model M",
  //     date: "64950",
  //     time: "5:23",
  //     sum: "2300 / UAH",
  //   },
  // ]);

  // Column Definitions: Defines the columns to be displayed.
  const columnDefs = useMemo<ColDef<Transaction>[]>(
    () => [
      {
        field: "category",
        headerName: "Category",
        minWidth: 150,
      },
      {
        field: "comment",
        headerName: "Comment",
        minWidth: 150,
      },
      {
        field: "date",
        headerName: "Date",
        minWidth: 170,
        // valueFormatter: (params: ValueFormatterParams) => {
        //   if (!params.value) return "";
        //   const date = new Date(params.value);
        //   return date.toLocaleDateString("uk-UA");
        // },
        // !Number(params.value)???
      },
      {
        field: "time",
        headerName: "Time",
        maxWidth: 100,
      },
      {
        field: "sum",
        headerName: "Sum",
        minWidth: 150,
        // valueFormatter: (params: ValueFormatterParams) => {
        //   return params.value != null ? `${params.value} UAH` : "";
        // },
      },
      {
        headerName: "Action",
        cellRenderer: ActionsRenderer,
        minWidth: 327,
        resizable: false,

        // suppress this keyboard event in the (ag) grid cell
        suppressKeyboardEvent: (params) => {
          const { event } = params;
          if (event.key === "Tab") return true;
          return false;
        },
      },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      sortable: false,
      filter: false,
    }),
    [],
  );

  //   const autoSizeStrategy = useMemo<AutoSizeStrategy>(() => {
  //     return {
  //       type: "fitCellContents",
  //         defaultMaxWidth: 280,
  //         defaultMinWidth: 100,
  //     };
  //   }, []);

  const isLight = resolvedTheme === "light";

  const myTheme = themeQuartz.withParams({
    accentColor: isLight ? "#1BE0E0" : "#0EF387",
    backgroundColor: isLight ? "#E9E0E0" : "#171719",
    borderRadius: 0,
    browserColorScheme: isLight ? "light" : "dark",
    cellHorizontalPaddingScale: 1,
    chromeBackgroundColor: {
      ref: "backgroundColor",
    },
    columnBorder: false,
    fontFamily: {
      googleFont: "Inter, sans-serif",
    },
    fontSize: 20,
    foregroundColor: isLight ? "#111111" : "#FAFAFA",
    headerBackgroundColor: isLight ? "#E9E0E0" : "#121214",
    headerFontFamily: {
      googleFont: "Inter, sans-serif",
    },
    headerFontSize: 16,
    headerFontWeight: 400,
    headerHeight: 60,
    headerRowBorder: false,
    headerTextColor: isLight ? "rgba(17, 17, 17, 0.6)" : "#6F6F70",
    rowBorder: false,
    rowHeight: 68,
    spacing: 20,
    rowHoverColor: isLight ? "rgba(27, 224, 224, 0.1)" : "#4343453D",
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
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        theme={myTheme}
        suppressCellFocus={true}
        // ensureDomOrder={true}
        // autoSizeStrategy={autoSizeStrategy}
        // debounceVerticalScrollbar={true} // smoother scrolling on slow machines
      />
    </div>
  );
};

export default TransactionsList;
