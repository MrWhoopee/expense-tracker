import { Category } from "@/type/category";
import { apiNext } from "./api";
import { cookies } from "next/headers";
import { UserInfo } from "@/type/userInfo";
import { GetStatistic } from "@/type/statistics";

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

export async function checkSessionServer(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await apiNext.get("/auth/session", {
    headers: {
      Cookie: cookieString,
    },
  });

  return res.data.success;
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

export async function getStasticsServer(): Promise<GetStatistic[]> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await apiNext.get<GetStatistic[]>(
    "/stats/categories/current-month",
    {
      headers: {
        Cookie: cookieString,
      },
    },
  );

  return res.data;
}
