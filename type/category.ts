export type Income = {
  _id: string;
  categoryName: string;
  type: string;
};

export type Expenses = {
  _id: string;
  categoryName: string;
  type: string;
};

export type Category = {
  income: Income[];
  expense: Expenses[];
};
