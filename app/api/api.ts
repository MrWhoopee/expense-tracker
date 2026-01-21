import axios from "axios";

export const api = axios.create({
  baseURL: "https://expense-tracker-v2.b.goit.study",
  withCredentials: true,
});
