"use client";

// import { checkSession, getMe } from "@/lib/api/clientApi";
// import { useAuthStore } from "@/lib/store/authStore";
// import { useEffect, useState } from "react";
// import Loader from "../Loader/Loader";
// import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  // const setUser = useAuthStore((state) => state.setUser);
  // const [isChecking, setIsChecking] = useState(true);
  // const clearIsAuthenticated = useAuthStore(
  //   (state) => state.clearIsAuthenticated,
  // );
  // const pathname = usePathname();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     setIsChecking(true);
  //     // Перевіряємо сесію
  //     const isAuthenticated = await checkSession();
  //     if (isAuthenticated) {
  //       // Якщо сесія валідна — отримуємо користувача
  //       const user = await getMe();
  //       if (user) setUser(user);
  //     } else {
  //       // Якщо сесія невалідна — чистимо стан
  //       clearIsAuthenticated();
  //       // Якщо користувач на приватній сторінці — перевірка не пройшла -> вихід
  //       const isPrivateRoute = ["/profile", "/notes"].some((route) =>
  //         pathname.startsWith(route),
  //       );
  //       if (isPrivateRoute) {
  //         // Maybe force redirect here? But proxy handles it.
  //         // Prompt says "content not displayed". Loader handles that initially.
  //         // "при переході на приватну сторінку виконує повторну перевірку сесії"
  //       }
  //     }
  //     setIsChecking(false);
  //   };
  //   fetchUser();
  // }, [setUser, clearIsAuthenticated, setIsChecking, pathname]);

  // return <>{isChecking ? <></> : children}</>;
  return <>{children}</>;
}
