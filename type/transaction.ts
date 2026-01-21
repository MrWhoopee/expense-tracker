export interface Transaction {
  _id: string;
  type: string;
  date: string;
  time: string;
  category: {
    _id: string;
    categoryName: string;
  };
  sum: number;
  comment: string;
}
