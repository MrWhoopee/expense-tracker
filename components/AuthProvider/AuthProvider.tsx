"use client";

import { checkSession, getUser } from "@/lib/clientApi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const setUser = useUserStore((state) => state.setUser);
  const [isChecking, setIsChecking] = useState(true);
  const logout = useUserStore((state) => state.logout);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      setIsChecking(true);
      try {
        // Перевіряємо сесію
        const isAuthenticated = await checkSession();
        if (isAuthenticated) {
          // Якщо сесія валідна — отримуємо користувача
          const user = await getUser();
          if (user) setUser(user);
        } else {
          // Якщо сесія невалідна — чистимо стан
          logout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setIsChecking(false);
      }
    };
    fetchUser();
  }, [setUser, logout, pathname]);

  return <>{isChecking ? <Loader /> : children}</>;
}
