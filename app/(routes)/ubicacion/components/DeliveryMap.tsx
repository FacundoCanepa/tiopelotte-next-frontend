"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { zonas } from "./zonas";

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

const DeliveryMap = () => {
  const [isClient, setIsClient] = useState(false);

  // Verificar si estamos en el cliente
  if (typeof window !== "undefined" && !isClient) {
    setIsClient(true);
  }

  if (!isClient) {
    return (
      <section className="my-20 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-garamond italic mb-4 text-center text-[#8B4513]">
          Mapa interactivo de zonas de entrega
        </h2>
        <p className="text-center text-[#6B4A2C] max-w-2xl mx-auto mb-8">
          Visualizá claramente las zonas donde realizamos envíos. Si tu barrio está incluido, podés encargar por la web y coordinamos la entrega.
        </p>
        <div className="h-[500px] w-full bg-gray-200 rounded-xl flex items-center justify-center border-4 border-[#FBE6D4] shadow-lg">
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </section>
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
    <section className="my-20 px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-garamond italic mb-4 text-center text-[#8B4513]">
        Mapa interactivo de zonas de entrega
      </h2>
      <p className="text-center text-[#6B4A2C] max-w-2xl mx-auto mb-8">
        Visualizá claramente las zonas donde realizamos envíos. Si tu barrio está incluido, podés encargar por la web y coordinamos la entrega.
      </p>
      <div className="rounded-xl overflow-hidden border-4 border-[#FBE6D4] shadow-lg">
        <MapContainer
          center={[-35.02, -58.1]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
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
    </section>
  );
};

export default DeliveryMap;