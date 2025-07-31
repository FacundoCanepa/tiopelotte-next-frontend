"use client";

import { useState, useEffect } from "react";
import { zonas } from "./zonas";

const DeliveryMap = () => {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Cargar componentes de Leaflet solo en el cliente
    const loadMapComponents = async () => {
      try {
        const [
          { MapContainer },
          { TileLayer },
          { Polygon },
          { Tooltip },
          { Marker },
          { Popup }
        ] = await Promise.all([
          import("react-leaflet").then((mod) => ({ MapContainer: mod.MapContainer })),
          import("react-leaflet").then((mod) => ({ TileLayer: mod.TileLayer })),
          import("react-leaflet").then((mod) => ({ Polygon: mod.Polygon })),
          import("react-leaflet").then((mod) => ({ Tooltip: mod.Tooltip })),
          import("react-leaflet").then((mod) => ({ Marker: mod.Marker })),
          import("react-leaflet").then((mod) => ({ Popup: mod.Popup }))
        ]);

        // Crear icono
        const L = await import("leaflet");
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        const localPosition: [number, number] = [-34.99517, -58.04874];

        setMapComponents(() => (
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
            <Marker position={localPosition} icon={icon}>
              <Popup>
                Tío Pelotte<br /> Av. 197 e/ 43 y 44, Abasto
              </Popup>
            </Marker>
          </MapContainer>
        ));
      } catch (error) {
        console.error("Error cargando mapa:", error);
      }
    };

    loadMapComponents();
  }, []);

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

  return (
    <section className="my-20 px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-garamond italic mb-4 text-center text-[#8B4513]">
        Mapa interactivo de zonas de entrega
      </h2>
      <p className="text-center text-[#6B4A2C] max-w-2xl mx-auto mb-8">
        Visualizá claramente las zonas donde realizamos envíos. Si tu barrio está incluido, podés encargar por la web y coordinamos la entrega.
      </p>
      <div className="rounded-xl overflow-hidden border-4 border-[#FBE6D4] shadow-lg">
        {MapComponents || (
          <div className="h-[500px] w-full bg-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DeliveryMap;