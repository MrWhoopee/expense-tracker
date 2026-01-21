import { Income, Expenses } from "./categoty";

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  currency: string;
  categories: {
    incomes: Income[];
    expenses: Expenses[];
  };
  transactionsTotal: {
    incomes: number;
    expenses: number;
  };
}