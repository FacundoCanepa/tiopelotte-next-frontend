"use client";

import { useState, useEffect } from "react";
import { zonas } from "@/app/(routes)/ubicacion/components/zonas";
import CheckoutForm from "./CheckoutForm";

/**
 * Mapa de delivery para checkout optimizado para producción
 */
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
  const [MapComponents, setMapComponents] = useState<React.ComponentType | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadError, setLoadError] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    
    const loadMapComponents = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Importar CSS de leaflet
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        // Cargar componentes dinámicamente
        const [
          { MapContainer },
          { TileLayer },
          { Polygon },
          { Tooltip },
          { Marker },
          { Popup },
          L
        ] = await Promise.all([
          import("react-leaflet").then(mod => ({ MapContainer: mod.MapContainer })),
          import("react-leaflet").then(mod => ({ TileLayer: mod.TileLayer })),
          import("react-leaflet").then(mod => ({ Polygon: mod.Polygon })),
          import("react-leaflet").then(mod => ({ Tooltip: mod.Tooltip })),
          import("react-leaflet").then(mod => ({ Marker: mod.Marker })),
          import("react-leaflet").then(mod => ({ Popup: mod.Popup })),
          import("leaflet")
        ]);

        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const localPosition: [number, number] = [-34.99517, -58.04874];

        const MapComponent = () => (
          <MapContainer
            center={[-35.02, -58.1]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {zonas.map((zona, i) => (
              <Polygon
                key={`checkout-zona-${i}`}
                positions={zona.coords}
                pathOptions={{ 
                  color: zona.color, 
                  fillOpacity: 0.4,
                  weight: 2
                }}
              >
                <Tooltip sticky>
                  <div className="text-center">
                    <strong>{zona.nombre}</strong><br />
                    Envío: {zona.precio}
                  </div>
                </Tooltip>
              </Polygon>
            ))}
            <Marker position={localPosition} icon={icon}>
              <Popup>
                <div className="text-center">
                  <strong>🍝 Tío Pelotte</strong><br />
                  Av. 197 e/ 43 y 44, Abasto
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        );

        setMapComponents(() => MapComponent);
      } catch (error) {
        console.error("Error cargando mapa de checkout:", error);
        setLoadError("No se pudo cargar el mapa.");
      }
    };

    const timeoutId = setTimeout(loadMapComponents, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 w-full">
          <h3 className="text-lg font-semibold text-[#5A3E1B] mb-2">Zonas de entrega</h3>
          <div className="h-[300px] md:h-[400px] w-full bg-gray-200 rounded-xl flex items-center justify-center border-4 border-[#FBE6D4] shadow-lg">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 w-full">
        <h3 className="text-lg font-semibold text-[#5A3E1B] mb-2">Zonas de entrega</h3>
        <div className="rounded-xl overflow-hidden border-4 border-[#FBE6D4] shadow-lg h-[300px] md:h-[400px] relative">
          {loadError ? (
            <div className="h-full w-full bg-red-50 flex items-center justify-center">
              <div className="text-center text-red-600">
                <p className="font-semibold">⚠️ {loadError}</p>
                <p className="text-sm mt-1">Seleccioná tu zona abajo</p>
              </div>
            </div>
          ) : MapComponents ? (
            <MapComponents />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600">Cargando mapa...</p>
              </div>
            </div>
          )}
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