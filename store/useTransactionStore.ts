import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreateTransaction {
  type: string;
  date: Date | string | null;
  time: Date | string | null;
  category: string;
  sum: number | string;
  comment: string;
}

interface TransactionStore {
  transactionDraft: CreateTransaction;
  setTransactionDraft: (transaction: CreateTransaction) => void;
  clearTransactionDraft: () => void;
  draftCategoryId: string;
  setDraftCategoryId: (cid: string) => void;
  clearDraftCategoryId: () => void;
}

const initialTransactionDraft = {
  type: "",
  date: new Date(),
  time: new Date(),
  category: "",
  sum: "",
  comment: "",
};

const initialCategoryId = "";

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set): TransactionStore => ({
      transactionDraft: initialTransactionDraft,
      setTransactionDraft: (transaction) =>
        set({ transactionDraft: transaction }),

      clearTransactionDraft: () =>
        set({ transactionDraft: initialTransactionDraft }),

      draftCategoryId: initialCategoryId,

      setDraftCategoryId: (cid) => set({ draftCategoryId: cid }),

      clearDraftCategoryId: () => set({ draftCategoryId: initialCategoryId }),
    }),
    {
      name: "transaction-draft",
      partialize: (state) => ({
        transactionDraft: state.transactionDraft,
        draftCategoryId: state.draftCategoryId, // fix key
      }),
    },
  ),
);
