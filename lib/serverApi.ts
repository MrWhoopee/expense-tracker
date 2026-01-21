import { Category } from "@/type/categoty";
import { apiServer } from "./api";
import { cookies } from "next/headers";
import { UserInfo } from "@/type/userInfo";

export async function getCategoriesServer(): Promise<Category> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const res = await apiServer.get<Category>("/categories", {
    headers: {
      Cookie: cookieString,
    },
  });

  return res.data;
}

export async function checkSessionServer(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await apiServer.get("/auth/session", {
    headers: {
      Cookie: cookieString,
    },
  });

  return res.data.success;
}

export async function getUserServer(): Promise<UserInfo> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  const res = await apiServer.get<UserInfo>("/users/current", {
    headers: {
      Cookie: cookieString,
    },
  });

  return res.data;
}
