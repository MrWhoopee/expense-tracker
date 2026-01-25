import { Category } from "@/type/category";
import { apiNext } from "./api";
import { User } from "@/type/user";
import { Transaction } from "@/type/transaction";
import { UserInfo } from "@/type/userInfo";

interface UserCategory {
  type: string;
  categoryName: string;
}

interface UpdateCategory {
  _id: string;
  categoryName: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SessionResponse {
  success: boolean;
}

interface ChangeUser {
  name: string;
  currency: string;
}

interface UpdatePhoto {
  avatarUrl: string;
}

interface CreateTransaction {
  type: string;
  date: string;
  time: string;
  category: string;
  sum: number;
  comment: string;
}

interface UpdateTransaction {
  date: string;
  time: string;
  category: string;
  sum: number;
  comment: string;
}

export interface CategoryStats {
  _id: string;
  totalAmount: number;
  category: string;
}

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

export async function getUser(): Promise<UserInfo> {
  const res = await apiNext.get<UserInfo>("/users/current");

  return res.data;
}

export async function changeUser(body: ChangeUser): Promise<void> {
  await apiNext.patch<void>("/users/info", body);
}

export async function updatePhoto(photo: UpdatePhoto): Promise<void> {
  await apiNext.patch<void>("/users/avatar", photo);
}

export async function deletePhoto(): Promise<void> {
  await apiNext.delete<void>("/users/avatar");
}

//Transaction

export async function createTransaction(
  body: CreateTransaction,
): Promise<void> {
  await apiNext.post("/transactions", body);
}

export async function getTransactionByType(
  type: string,
): Promise<Transaction[]> {
  const { data } = await apiNext.get<Transaction[]>(`/transactions/${type}`);

  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiNext.delete<void>(`/transactions/${id}`);
}

export async function updateTransaction(
  type: string,
  id: string,
  body: UpdateTransaction,
): Promise<void> {
  await apiNext.patch(`/transactions/${type}/${id}`, body);
}

export async function getStatsCurrentMonth(): Promise<CategoryStats[]> {
  const { data } = await apiNext.get<CategoryStats[]>(
    "/stats/categories/current-month",
  );
  return data;
}
