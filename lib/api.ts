import axios from "axios";

export const apiNext = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

apiNext.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);
