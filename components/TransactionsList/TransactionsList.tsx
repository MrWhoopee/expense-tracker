"use client";

import { useCallback, useMemo, useState } from "react";
import css from "./TransactionsList.module.css";
import {
  AllCommunityModule,
  AutoSizeStrategy,
  ColDef,
  ModuleRegistry,
  themeQuartz,
  ValueFormatterParams,
} from "ag-grid-community";
import { ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import Image from "next/image";
import { Transaction } from "@/type/transaction";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, getTransactionByType } from "@/lib/clientApi";
import toast from "react-hot-toast";
import Modal from "../MainModal/MainModal";
import TransactionForm from "../TransactionForm/TransactionForm";
import { useUserStore } from "@/store/useUserStore";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// buttons renderer
const ActionsRenderer = (props: ICellRendererParams<Transaction>) => {
  const onEdit = () => {
    if (props.data) {
      props.context.handleEdit(props.data);
    }
  };

  const onDelete = () => {
    const id = props.data?._id;
    if (id) {
      props.context.handleDelete(id);
    }
  };

  return (
    <div className={css.actionsCell}>
      <button tabIndex={0} onClick={onEdit} className={css.editBtn}>
        <Image src="/edit.svg" alt="Edit" width={16} height={16} />
        <span className={css.btnText}>Edit</span>
      </button>
      <button tabIndex={0} onClick={onDelete} className={css.deleteBtn}>
        <Image src="/delete.svg" alt="Delete" width={16} height={16} />
        <span className={css.btnText}>Delete</span>
      </button>
    </div>
  );
};

// not found for ag grid
const NoTransactionsOverlay = () => (
  <div
    style={{
      textAlign: "center",
      fontSize: "18px",
      color: "#fafafa",
      zIndex: "999",
    }}
  >
    <p>No transactions found</p>
  </div>
);

// loader for ag grid
export const LoadingOverlay = () => (
  <div
    style={{
      fontSize: "18px",
      color: "#fafafa",
      zIndex: "999",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
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
  type: string;
  date?: string;
  search?: string;
}

const TransactionsList = ({ type, date, search }: TransactionsListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const userData = useUserStore((s) => s.user);

  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  }, []);

  const handleEdit = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      mutate(id);
    },
    [mutate],
  );

  const gridContext = useMemo(
    () => ({
      handleDelete,
      handleEdit,
    }),
    [handleDelete, handleEdit],
  );

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isTablet =
    typeof window !== "undefined" &&
    window.innerWidth >= 768 &&
    window.innerWidth < 1200;

  const columnDefs = useMemo<ColDef<Transaction>[]>(
    () => [
      {
        field: "category",
        headerName: "Category",
        minWidth: 100,
        flex: 1.5,

        valueFormatter: (params) => {
          return params.value?.categoryName || "";
        },
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
        flex: 0.5,
        sort: "desc", // new data first
        sortIndex: 0, // priority №1

        valueFormatter: (params) => {
          if (!params.value) return "";

          const date = new Date(params.value);

          const options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };

          const formatter = new Intl.DateTimeFormat("en-GB", options);
          const parts = formatter.formatToParts(date);

          const dayName = parts.find((p) => p.type === "weekday")?.value;
          const day = parts.find((p) => p.type === "day")?.value;
          const month = parts.find((p) => p.type === "month")?.value;
          const year = parts.find((p) => p.type === "year")?.value;

          return `${dayName}, ${day}.${month}.${year}`;
        },
      },

      {
        field: "time",
        headerName: "Time",
        minWidth: 55,
        maxWidth: 150,
        flex: 0.5,
        sort: "desc", // new data first
        sortIndex: 1, // priority №2
      },
      {
        field: "sum",
        headerName: "Sum",
        minWidth: 155,
        flex: 1,
        cellRenderer: "agAnimateShowChangeCellRenderer",

        valueFormatter: (params: ValueFormatterParams) => {
          if (params.value == null) return "";

          const currency = userData?.currency?.toUpperCase() || "UAH";

          const formattedValue = Number(params.value).toLocaleString("en-GB");

          return `${formattedValue} ${currency}`;
        },
      },
      {
        headerName: "Action",
        cellRenderer: ActionsRenderer,
        cellClass: css.actionsColumn,
        resizable: false,
        minWidth: isMobile || isTablet ? 120 : 265,
        flex: isMobile || isTablet ? 0.75 : 2,
        enableCellChangeFlash: false,

        // suppress this keyboard event in the ag grid cell
        suppressKeyboardEvent: (params) => {
          const { event } = params;
          if (event.key === "Tab") return true;
          return false;
        },
      },
    ],
    [isMobile, isTablet, userData?.currency],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: false,
      filter: false,
      // resizable: false,
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

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["transactions", type, date, search],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // watch my loader
      return getTransactionByType({ type, date, search });
    },
    refetchOnMount: false,
  });

  const noRowsOverlayComponent = NoTransactionsOverlay;

  return (
    <div className={css.gridWrapper}>
      {(isPending || isFetching) && <LoadingOverlay />}
      <div
        style={{
          visibility: isPending || isFetching ? "hidden" : "visible",
          height: "100%",
          width: "100%",
        }}
      >
        <AgGridReact
          className={css.gridContainer}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          theme={myTheme}
          context={gridContext}
          getRowId={(params) => params.data._id}
          suppressCellFocus={true}
          autoSizeStrategy={autoSizeStrategy}
          suppressHorizontalScroll={true} // just in case
          suppressMovableColumns={true}
          loadingOverlayComponent={null}
          noRowsOverlayComponent={noRowsOverlayComponent}
          loadingOverlayComponentParams={{}}
          onGridReady={(params) => {
            // params.api.sizeColumnsToFit();
            if (!data || data.length === 0) {
              params.api.showNoRowsOverlay();
            }
          }}
        />
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <TransactionForm
              transaction={selectedTransaction}
              closeTransactionModal={closeModal}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
