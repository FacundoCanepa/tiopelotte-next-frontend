/**
 * Componente PWA Prompt para instalación de la app
 * 
 * Características:
 * - Detección automática de soporte PWA
 * - Prompts nativos diferenciados por plataforma
 * - UX no intrusiva con timing adecuado
 * - Persistencia de decisiones del usuario
 * - Diseño integrado con la marca Tío Pelotte
 */

"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar si ya está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Handler para el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt después de 30 segundos si el usuario no ha rechazado antes
      const hasRejected = localStorage.getItem('pwa-prompt-rejected');
      if (!hasRejected && !isStandalone) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 30000); // 30 segundos
      }
    };

    // Handler para cuando se instala la app
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "pwa_install", {
          event_category: "engagement",
          event_label: "app_installed"
        });
      }
      
      toast.success("¡Tío Pelotte instalado exitosamente!", {
        description: "Ahora podés acceder desde tu pantalla de inicio"
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('📱 Usuario aceptó instalar PWA');
        
        // Analytics
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "pwa_install_accepted", {
            event_category: "engagement"
          });
        }
      } else {
        console.log('📱 Usuario rechazó instalar PWA');
        localStorage.setItem('pwa-prompt-rejected', 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error durante instalación PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-rejected', 'true');
    
    // Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "pwa_install_dismissed", {
        event_category: "engagement"
      });
    }
  };

  // No mostrar si ya está instalado o no hay soporte
  if (isInstalled || (!deferredPrompt && !isIOS) || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border-2 border-[#FFD966] rounded-2xl shadow-xl p-4 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FBE6D4] rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-[#8B4513]" />
            </div>
            <div>
              <h3 className="font-bold text-[#8B4513] text-sm">
                ¡Instalá Tío Pelotte!
              </h3>
              <p className="text-xs text-gray-600">
                Acceso rápido desde tu pantalla
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-600 mb-4">
          {isIOS 
            ? "Tocá el botón de compartir y seleccioná 'Agregar a pantalla de inicio'"
            : "Instalá nuestra app para acceso rápido y mejor experiencia"
          }
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#6B3410] transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Instalar
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#8B4513] border border-[#E6D2B5] hover:bg-gray-50 transition-colors"
          >
            Después
          </button>
        </div>
      </div>
    </div>
  );
}