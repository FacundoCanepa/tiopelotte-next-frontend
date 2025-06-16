"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  useUserStore();
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);
  return null;
}