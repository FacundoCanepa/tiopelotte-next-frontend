"use client";

import { zonas } from "@/app/(routes)/ubicacion/components/zonas";
import ZonaSelect from "../../perfil/components/ZonaSelect";
import { Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  tipoEntrega: "domicilio" | "local";
  zona: string;
  setZona: (val: string) => void;
  direccion: string;
  setDireccion: (val: string) => void;
  referencias: string;
  setReferencias: (val: string) => void;
}

export default function CheckoutForm({
  tipoEntrega,
  zona,
  setZona,
  direccion,
  setDireccion,
  referencias,
  setReferencias,
}: Props) {
  const zonaSeleccionada = zonas.find((z) => z.nombre === zona);

  return (
    <AnimatePresence initial={false}>
      {tipoEntrega === "domicilio" && (
        <motion.div
          key="direccion"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 overflow-hidden"
        >
          <div>
            <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
              Zona
            </label>
            <ZonaSelect value={zona} onChange={setZona} />
            {zonaSeleccionada && (
              <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                <Truck size={18} />
                Costo de envío:
                <span className="font-semibold ml-1">
                  {zonaSeleccionada.precio}
                </span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
              Dirección
            </label>
            <input
              type="text"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
              Referencias (opcional)
            </label>
            <textarea
              value={referencias}
              onChange={(e) => setReferencias(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
