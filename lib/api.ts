import axios from "axios";

export const apiNext = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

export const apiServer = axios.create({
  baseURL: `${process.env.SERVER_PUBLIC_API_URL}`,
  withCredentials: true,
});
