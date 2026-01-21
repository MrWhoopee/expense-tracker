import axios from 'axios';

export const apiNext = axios.create({
  baseURL:`${process.env.NEXT_PUBLIC_SECRET_KEY}`,
  withCredentials: true,
});     