"use client";

import { useUserStore } from "@/store/user-store";
import PerfilForm from "./PerfilForm";

export default function DatosUsuario() {
  const user = useUserStore((state) => state.user);
  const jwt = useUserStore((state) => state.jwt);

  if (!user) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Datos personales</h2>
      {jwt && <PerfilForm userId={user.id} jwt={jwt} />}
    </section>
  );
}