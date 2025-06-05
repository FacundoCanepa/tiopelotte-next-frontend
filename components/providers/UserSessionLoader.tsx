"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  const checkLocalUser = useUserStore((state) => state.checkLocalUser);

  useEffect(() => {
    console.log("📦 Ejecutando checkLocalUser...");
    checkLocalUser();
  }, [checkLocalUser]);

  return null;
}
