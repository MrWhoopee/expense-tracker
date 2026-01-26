"use client";

import { useMemo } from "react";
import css from "./TransactionsList.module.css";
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
          <Image src="/edit.svg" alt="Edit" width={16} height={16} />
        </div>
      </div>

      <div className={css.deleteButtonContainer}>
        <button tabIndex={0} onClick={onDelete} className={css.deleteBtn}>
          Delete
        </button>
        <div className={css.deleteSvgContainer}>
          <Image
            src="/delete.svg"
            alt="Delete"
            width={16}
            height={16}
            className={css.deleteSvg}
          />
        </div>
      </div>
    </div>
  );
};

interface TransactionsListProps {
  data: Transaction[];
}

const TransactionsList = ({ data }: TransactionsListProps) => {
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

  const myTheme = themeQuartz.withParams({
    accentColor: "#6F6F70",
    backgroundColor: "#171719",
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
