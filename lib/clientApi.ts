import { Category } from "@/type/categoty";
import { apiNext } from "./api";

type UserCategory = {
  type: string;
  categoryName: string;
};

export async function getCategories(): Promise<Category> {
  const res = await apiNext.get<Category>("/categories");

  return res.data;
}

export async function createCategories(
  userCategory: UserCategory,
): Promise<void> {
  await apiNext.post<void>("/categories", userCategory);
}
