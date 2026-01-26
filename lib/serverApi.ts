import { Category } from "@/type/category";
import { apiNext } from "./api";
import { cookies } from "next/headers";
import { UserInfo } from "@/type/userInfo";
import { Statistic } from "@/type/statistics";

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
