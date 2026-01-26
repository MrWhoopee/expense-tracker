"use client";

import Loader from "@/components/Loader/Loader";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    startTransition(() => {
      router.refresh();
      setIsLoaded(true);
    });
  }, [router]);

  if (!isLoaded || isPending) {
    return <Loader />;
  }

  return <>{children}</>;
}
