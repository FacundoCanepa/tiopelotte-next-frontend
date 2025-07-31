"use client";

import { useState, useEffect } from "react";
import { zonas } from "./zonas";

/**
 * Componente de mapa optimizado para producción
 * Carga leaflet de forma asíncrona para evitar errores SSR
 */
const DeliveryMap = () => {
  const [MapComponents, setMapComponents] = useState<React.ComponentType | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadError, setLoadError] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    
    const loadMapComponents = async () => {
      try {
        // Verificar que estamos en el cliente
        if (typeof window === 'undefined') return;

        // Importar leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        // Cargar componentes de react-leaflet dinámicamente
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

        // Configurar icono de leaflet
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const localPosition: [number, number] = [-34.99517, -58.04874];

        // Crear componente del mapa
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
                key={`zona-${i}`}
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
                  Av. 197 e/ 43 y 44, Abasto<br />
                  <small>Fábrica de pastas artesanales</small>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        );

        setMapComponents(() => MapComponent);
      } catch (error) {
        console.error("Error cargando componentes del mapa:", error);
        setLoadError("No se pudo cargar el mapa interactivo.");
      }
    };

    // Cargar con un pequeño delay para asegurar hidratación
    const timeoutId = setTimeout(loadMapComponents, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Loading state
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
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando mapa interactivo...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (loadError) {
    return (
      <section className="my-20 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-garamond italic mb-4 text-center text-[#8B4513]">
          Zonas de entrega
        </h2>
        <div className="h-[500px] w-full bg-red-50 rounded-xl flex items-center justify-center border-4 border-red-200 shadow-lg">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold mb-2">⚠️ {loadError}</p>
            <p className="text-sm">Contactanos por WhatsApp para consultar tu zona</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-20 px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-garamond italic mb-4 text-center text-[#8B4513]">
        Mapa interactivo de zonas de entrega
      </h2>
      <p className="text-center text-[#6B4A2C] max-w-2xl mx-auto mb-8">
        Visualizá claramente las zonas donde realizamos envíos. Si tu barrio está incluido, podés encargar por la web y coordinamos la entrega.
      </p>
      <div className="rounded-xl overflow-hidden border-4 border-[#FBE6D4] shadow-lg h-[500px]">
        {MapComponents ? (
          <MapComponents />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Inicializando mapa...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de zonas como fallback */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zonas.map((zona, index) => (
          <div 
            key={`zona-list-${index}`}
            className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#E6D2B5] shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#5A3E1B]">{zona.nombre}</span>
              <span 
                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: zona.color }}
              >
                {zona.precio}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DeliveryMap;