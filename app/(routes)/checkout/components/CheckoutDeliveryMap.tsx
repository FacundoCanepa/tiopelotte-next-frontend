"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { zonas } from "@/app/(routes)/ubicacion/components/zonas";
import CheckoutForm from "./CheckoutForm";

// Importar componentes de react-leaflet con SSR deshabilitado
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const CheckoutDeliveryMap = ({
  tipoEntrega,
  zona,
  setZona,
  direccion,
  setDireccion,
  referencias,
  setReferencias,
}: {
  tipoEntrega: "domicilio" | "local";
  zona: string;
  setZona: (val: string) => void;
  direccion: string;
  setDireccion: (val: string) => void;
  referencias: string;
  setReferencias: (val: string) => void;
}) => {
  const [isClient, setIsClient] = useState(false);

  // Verificar si estamos en el cliente
  if (typeof window !== "undefined" && !isClient) {
    setIsClient(true);
  }

  if (!isClient) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 w-full">
          <h3 className="text-lg font-semibold text-[#5A3E1B] mb-2">Zonas de entrega</h3>
          <div className="h-[400px] w-full bg-gray-200 rounded-xl flex items-center justify-center border-4 border-[#FBE6D4] shadow-lg">
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
          <p className="text-xs text-[#8B4513] mt-2 italic">
            Seleccioná tu zona abajo para calcular el envío.
          </p>
        </div>
        <div className="md:w-1/2 w-full">
          <CheckoutForm
            tipoEntrega={tipoEntrega}
            zona={zona}
            setZona={setZona}
            direccion={direccion}
            setDireccion={setDireccion}
            referencias={referencias}
            setReferencias={setReferencias}
          />
        </div>
      </div>
    );
  }

  const localPosition: [number, number] = [-34.99517, -58.04874];

  // Crear icono solo en el cliente
  const createIcon = () => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      return L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 w-full">
        <h3 className="text-lg font-semibold text-[#5A3E1B] mb-2">Zonas de entrega</h3>
        <div className="rounded-xl overflow-hidden border-4 border-[#FBE6D4] shadow-lg h-[300px] md:h-[400px] z-0 relative">
          <MapContainer
            center={[-35.02, -58.1]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.jawg.io">Jawg</a>'
              url="https://{s}.tile.jawg.io/sunny/{z}/{x}/{y}.png?access-token=4MSVRrDpN6DB4eM9p3oKlH6d6HLhyBfgWG70l7dfIshQbY5VN6SiirFBGkiiSKmY"
            />
            {zonas.map((zona, i) => (
              <Polygon
                key={i}
                positions={zona.coords}
                pathOptions={{ color: zona.color, fillOpacity: 0.5 }}
              >
                <Tooltip sticky>{`${zona.nombre} – ${zona.precio}`}</Tooltip>
              </Polygon>
            ))}
            <Marker position={localPosition} icon={createIcon()}>
              <Popup>
                Tío Pelotte<br /> Av. 197 e/ 43 y 44, Abasto
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <p className="text-xs text-[#8B4513] mt-2 italic">
          Seleccioná tu zona abajo para calcular el envío.
        </p>
      </div>

      <div className="md:w-1/2 w-full">
        <CheckoutForm
          tipoEntrega={tipoEntrega}
          zona={zona}
          setZona={setZona}
          direccion={direccion}
          setDireccion={setDireccion}
          referencias={referencias}
          setReferencias={setReferencias}
        />
      </div>
    </div>
  );
};

export default CheckoutDeliveryMap;