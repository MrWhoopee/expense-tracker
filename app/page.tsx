"use client";

import MainTransaction from "@/components/MainTransaction/MainTransaction";
import WelcomeContent from "@/components/WelcomeContent/WelcomeContent";
import { useUserStore } from "@/store/useUserStore";

export default function WelcomePage() {
  const { user } = useUserStore();
  return user ? <MainTransaction /> : <WelcomeContent />;
}
