"use client";

import { motion } from "framer-motion";
import DatosUsuario from "./DatosUsuario";
import ComprasRecientes from "./ComprasRecientes";

export default function PerfilWrapper() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-10 space-y-10"
    >
      <h1 className="text-3xl font-semibold text-center">Mi Perfil</h1>
      <DatosUsuario />
      <ComprasRecientes />
    </motion.div>
  );
}
