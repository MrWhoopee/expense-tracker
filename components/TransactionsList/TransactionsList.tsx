"use client";

import { useMemo } from "react";
import css from "./TransactionsList.module.css";
import {
  AllCommunityModule,
  AutoSizeStrategy,
  ColDef,
  ModuleRegistry,
  themeQuartz,
  // ValueFormatterParams,
} from "ag-grid-community";
import { ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Image from "next/image";
import { Transaction } from "@/type/transaction";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

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
          <span className={css.btnText}>Edit</span>
        </button>
        <div className={css.editSvgContainer}>
          <Image src="/edit.svg" alt="Edit" width={16} height={16} />
        </div>
      </div>

      <div className={css.deleteButtonContainer}>
        <button tabIndex={0} onClick={onDelete} className={css.deleteBtn}>
          <span className={css.btnText}>Delete</span>
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

// not found for ag grid
const NoTransactionsOverlay = () => (
  <div style={{ textAlign: "center", fontSize: "18px", color: "#fafafa" }}>
    <div style={{ fontSize: "50px", marginBottom: "-5px" }}>
      <RiMoneyDollarCircleLine />
    </div>
    <p>No transactions found</p>
  </div>
);

// loader for ag grid
export const LoadingOverlay = () => (
  <div style={{ textAlign: "center", fontSize: "18px", color: "#fafafa" }}>
    <div
      className="spinner"
      style={{
        fontSize: "50px",
        marginBottom: "-5px",
      }}
    >
      <RiMoneyDollarCircleLine />
    </div>
    <p>Loading your money data...</p>
    <style>{`
      .spinner {
        animation: coin-spin 1.5s infinite linear;
      }
      @keyframes coin-spin {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
    `}</style>
  </div>
);

interface TransactionsListProps {
  data: Transaction[];
  isLoading: boolean;
}

const TransactionsList = ({ data, isLoading }: TransactionsListProps) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isTablet =
    typeof window !== "undefined" &&
    window.innerWidth >= 768 &&
    window.innerWidth < 1200;

  // Column Definitions: Defines the columns to be displayed.
  const columnDefs = useMemo<ColDef<Transaction>[]>(
    () => [
      {
        field: "category",
        headerName: "Category",
        minWidth: 100,
        flex: 1.5,
      },
      {
        field: "comment",
        headerName: "Comment",
        minWidth: 100,
        flex: 2,
      },
      {
        field: "date",
        headerName: "Date",
        minWidth: 55,
        maxWidth: 150,
        flex: 0.5,

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
        minWidth: 55,
        maxWidth: 150,
        flex: 0.5,
      },
      {
        field: "sum",
        headerName: "Sum",
        minWidth: 55,
        maxWidth: 150,
        flex: 0.5,
        enableCellChangeFlash: true,
        cellRenderer: "agAnimateShowChangeCellRenderer",

        // valueFormatter: (params: ValueFormatterParams) => {
        //   return params.value != null ? `${params.value} UAH` : "";
        // },
      },
      {
        headerName: "Action",
        cellRenderer: ActionsRenderer,
        cellClass: css.actionsColumn,
        resizable: false,
        minWidth: isMobile || isTablet ? 120 : 265,
        // maxWidth: isMobile || isTablet ? 140 : 327,
        flex: isMobile || isTablet ? 0.75 : 2,

        // suppress this keyboard event in the ag grid cell
        suppressKeyboardEvent: (params) => {
          const { event } = params;
          if (event.key === "Tab") return true;
          return false;
        },
      },
    ],
    [isMobile, isTablet],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: false,
      filter: false,
      enableCellChangeFlash: true,
    }),
    [],
  );

  const autoSizeStrategy = useMemo<AutoSizeStrategy>(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

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
    fontSize: isMobile ? 14 : 20,
    foregroundColor: "#FAFAFA",
    headerBackgroundColor: "#121214",
    headerFontFamily: {
      googleFont: "Inter, sans-serif",
    },
    headerFontSize: isMobile ? 12 : 16,
    headerFontWeight: 400,
    headerHeight: isMobile ? 53 : 60,
    headerRowBorder: false,
    headerTextColor: "#6F6F70",
    rowBorder: false,
    rowHeight: isMobile ? 46 : 72,
    spacing: 20,
    rowHoverColor: "#4343453D",
    rowVerticalPaddingScale: 1.2,
    sidePanelBorder: false,
    wrapperBorder: false,
    wrapperBorderRadius: 0,
  });

  if (isLoading) {
    return (
      <div
        className={css.gridWrapper}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className={css.gridWrapper}>
      <AgGridReact
        className={css.gridContainer}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        theme={myTheme}
        suppressCellFocus={true}
        autoSizeStrategy={autoSizeStrategy}
        suppressHorizontalScroll={false} // just in case
        suppressMovableColumns={true}
        noRowsOverlayComponent={NoTransactionsOverlay}
        loadingOverlayComponentParams={{}}
        suppressNoRowsOverlay={isLoading} // disabled the automatic display of "No Rows" so that it doesn't conflict with the loader

        // ensureDomOrder={true}
        // debounceVerticalScrollbar={true} // smoother scrolling on slow machines
      />
    </div>
  );
};

export default TransactionsList;
