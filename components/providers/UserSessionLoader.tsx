"use client";
import { useUserStore } from "@/store/user-store";

export default function UserSessionLoader() {
  useUserStore();
    return null;
}