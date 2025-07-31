"use client";

import { MessageCircle } from "lucide-react";

/**
 * Botón de WhatsApp optimizado con CSS puro
 * Componente cliente para evitar problemas de SSR
 */
const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5492213086600?text=Hola%20T%C3%ADo%20Pelotte%2C%20quiero%20hacer%20un%20pedido"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;