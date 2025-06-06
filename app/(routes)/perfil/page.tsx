"use client";

import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import PerfilHeader from "./components/PerfilHeader";
import PerfilDatosUsuario from "./components/PerfilDatosUsuario";
import PerfilActions from "./components/PerfilActions";
import PerfilSugerencias from "./components/PerfilSugerencias";

export default function PerfilPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const jwt = useUserStore((state) => state.jwt);

  useEffect(() => {
    if (!user || !jwt) {
      router.push("/login");
    }
  }, [user, jwt, router]);

  if (!user || !jwt) return null;

  return (
    <div className="space-y-10">
      <div className="max-w-3xl mx-auto p-4 space-y-10">
      <PerfilHeader />
      <PerfilDatosUsuario />
      <PerfilActions />
      </div>
      <PerfilSugerencias />
    </div>
    
  );
}
