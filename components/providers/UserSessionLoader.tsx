"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  useEffect(() => {
    useUserStore.getState().checkLocalUser();
  }, []);

  return null;
}
