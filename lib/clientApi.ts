import { Category, Income, Expenses } from "@/type/categoty";
import { apiNext } from "./api";
import { User } from "@/type/user";

type UserCategory = {
  type: string;
  categoryName: string;
};

type UpdateCategory = {
  _id: string;
  categoryName: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type UserInfo = {
  _id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  currency: string;
  categories: {
    incomes: Income[];
    expenses: Expenses[];
  };
  transactionsTotal: {
    incomes: number;
    expenses: number;
  };
};

type SessionResponse = {
  success: boolean;
};

//Category

export async function getCategories(): Promise<Category> {
  const res = await apiNext.get<Category>("/categories");

  return res.data;
}

export async function createCategory(
  userCategory: UserCategory,
): Promise<void> {
  await apiNext.post<void>("/categories", userCategory);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiNext.delete<void>(`/categories${id}`);
}

export async function updateCatecory(
  userCategory: UpdateCategory,
): Promise<void> {
  await apiNext.patch<void>(`/categories/${userCategory._id}`, userCategory);
}

//Auth

export async function userRegister(body: RegisterRequest): Promise<User> {
  const { data } = await apiNext.post<User>("/auth/register", body);

  return data;
}

export async function userLogin(body: LoginRequest): Promise<UserInfo> {
  const { data } = await apiNext.post<UserInfo>("/auth/login", body);

  return data;
}

export async function userLogout(): Promise<void> {
  await apiNext.post<void>("/auth/logout");
}

export async function checkSession(): Promise<boolean> {
  const res = await apiNext.get<SessionResponse>("/auth/session");

  return res.data.success;
}

//UserInfo

// export async function getUser(): Promise<UserInfo> {
//     const res = await apiNext.get<UserInfo>("/users/current");

//     return res
// }