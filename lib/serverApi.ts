import { Category } from "@/type/category";
import { apiNext } from "./api";
import { cookies } from "next/headers";
import { UserInfo } from "@/type/userInfo";
import { Statistic } from "@/type/statistics";
import { Transaction } from "@/type/transaction";

export async function getCategoriesServer(): Promise<Category> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const res = await apiNext.get<Category>("/categories", {
    headers: {
      Cookie: cookieString,
    },
  });

  return res.data;
}

export async function checkSessionServer() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await apiNext.get("/auth/session", {
    headers: {
      Cookie: cookieString,
    },
  });

  return res;
}

export async function getUserServer(): Promise<UserInfo> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await apiNext.get<UserInfo>("/users/current", {
    headers: {
      Cookie: cookieString,
    },
  });

  return res.data;
}

export async function getStatisticsServer(): Promise<Statistic[]> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await apiNext.get<Statistic[]>(
    "/stats/categories/current-month",
    {
      headers: {
        Cookie: cookieString,
      },
    },
  );

  return res.data;
}

// export async function getTransactionByType(
//   type: string,
// ): Promise<Transaction[]> {
//   const cookieStore = await cookies();
//   const cookieString = cookieStore.toString();

//   const { data } = await apiNext.get<Transaction[]>(`/transactions/${type}`, {
//     headers: {
//       Cookie: cookieString,
//     },
//   });

//   return data;
// }

export interface GetTransactionByTypeParams {
  type: string;
  date?: string;
  search?: string;
}

export async function getTransactionByType({
  type,
  date,
  search,
}: GetTransactionByTypeParams): Promise<Transaction[]> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const filteredParams = Object.fromEntries(
    Object.entries({ date, search }).filter(([value]) => Boolean(value)),
  ); // no undefined

  const { data } = await apiNext.get<Transaction[]>(`/transactions/${type}`, {
    headers: {
      Cookie: cookieString,
    },
    params: filteredParams,
  });

  return data;
}
