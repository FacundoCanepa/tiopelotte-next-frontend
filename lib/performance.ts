import React from "react";

/**
 * Utilidades avanzadas para optimización de rendimiento
 * 
 * Este archivo contiene funciones optimizadas para mejorar
 * el rendimiento de la aplicación TÍO PELOTTE, incluyendo
 * debounce, throttle, lazy loading, cache, y métricas de performance.
 */

// Debounce optimizado con cancelación manual para búsquedas y filtros
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let result: ReturnType<T>;
  
  const { leading = false, trailing = true } = options;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    // Ejecutar inmediatamente si es leading edge y no hay timeout activo
    if (leading && !timeout) {
      result = func(...args);
      return;
    }
    
    // Configurar timeout para trailing edge
    if (trailing) {
      timeout = setTimeout(() => {
        if (lastArgs) {
          result = func(...lastArgs);
        }
        timeout = null;
        lastArgs = null;
      }, wait);
    }
  };

  // Función para cancelar el debounce pendiente
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      lastArgs = null;
    }
  };

  // Función para ejecutar inmediatamente el callback pendiente
  debounced.flush = () => {
    if (timeout && lastArgs) {
      clearTimeout(timeout);
      result = func(...lastArgs);
      timeout = null;
      lastArgs = null;
    }
  };

  return debounced;
}

// Throttle optimizado para eventos de scroll y resize
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number;
  
  const { leading = true, trailing = true } = options;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      if (leading) {
        func(...args);
      }
      lastRan = Date.now();
      inThrottle = true;
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      
      if (trailing) {
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
    
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
}

// Lazy loading optimizado para imágenes con Intersection Observer
export function createImageLazyLoader(options: {
  rootMargin?: string;
  threshold?: number;
  fadeInDuration?: number;
} = {}) {
  const {
    rootMargin = '50px 0px',
    threshold = 0.1,
    fadeInDuration = 300
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            // Precargar imagen
            const imageLoader = new Image();
            imageLoader.onload = () => {
              img.src = src;
              img.classList.add('loaded');
              
              // Aplicar fade in suave
              img.style.transition = `opacity ${fadeInDuration}ms ease-in-out`;
              img.style.opacity = '1';
            };
            
            imageLoader.onerror = () => {
              // Fallback en caso de error
              img.src = '/placeholder.jpg';
              img.classList.add('error');
            };
            
            imageLoader.src = src;
            observer.unobserve(img);
          }
        }
      });
    },
    { rootMargin, threshold }
  );

  return {
    observe: (img: HTMLImageElement) => observer.observe(img),
    disconnect: () => observer.disconnect()
  };
}

// Cache inteligente para requests de API con TTL y invalidación
class IntelligentAPICache {
  private cache = new Map<string, {
    data: any;
    timestamp: number;
    ttl: number;
    hits: number;
  }>();
  
  private maxSize = 100; // Máximo 100 entradas en cache
  private defaultTTL = 5 * 60 * 1000; // 5 minutos por defecto

  /**
   * Obtiene datos del cache si están disponibles y válidos
   */
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Verificar si el item ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Incrementar hits para estadísticas
    item.hits++;
    return item.data;
  }

  /**
   * Guarda datos en cache con TTL específico
   */
  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    // Limpiar cache si está lleno (LRU simple)
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });
  }

  /**
   * Invalida cache por patrón de clave
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Elimina entradas menos utilizadas cuando el cache está lleno
   */
  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;
    
    this.cache.forEach((item, key) => {
      if (item.hits < leastHits) {
        leastHits = item.hits;
        leastUsedKey = key;
      }
    });
    
    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats() {
    return {
      size: this.cache.size,
      totalHits: Array.from(this.cache.values()).reduce((sum, item) => sum + item.hits, 0),
      keys: Array.from(this.cache.keys())
    };
  }
}

// Instancia global del cache
export const apiCache = new IntelligentAPICache();

// Preload optimizado de recursos críticos
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload de fuentes críticas
  const fonts = [
    '/_next/static/media/island-moments.woff2',
    '/_next/static/media/eb-garamond.woff2'
  ];
  
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = '';
    document.head.appendChild(link);
  });

  // Preload de rutas críticas
  const criticalRoutes = ['/productos', '/historia'];
  
  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
}

// Métricas de Web Vitals optimizadas
export function setupWebVitals() {
  if (typeof window === 'undefined') return;

  // Medir Largest Contentful Paint (LCP)
  const measureLCP = () => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Enviar métrica si es mayor al umbral recomendado (2.5s)
      if (lastEntry.startTime > 2500) {
        console.warn(`❌ LCP lento: ${lastEntry.startTime}ms`);
        
        // Aquí podrías enviar a analytics
        if (window.gtag) {
          window.gtag('event', 'web_vital', {
            name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'performance'
          });
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  };

  // Medir First Input Delay (FID)
  const measureFID = () => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        
        // Enviar si es mayor al umbral (100ms)
        if (fid > 100) {
          console.warn(`❌ FID lento: ${fid}ms`);
          
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              name: 'FID',
              value: Math.round(fid),
              event_category: 'performance'
            });
          }
        }
      });
    }).observe({ entryTypes: ['first-input'] });
  };

  // Medir Cumulative Layout Shift (CLS)
  const measureCLS = () => {
    let clsValue = 0;
    
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      // Enviar si supera el umbral (0.1)
      if (clsValue > 0.1) {
        console.warn(`❌ CLS alto: ${clsValue}`);
        
        if (window.gtag) {
          window.gtag('event', 'web_vital', {
            name: 'CLS',
            value: Math.round(clsValue * 1000) / 1000,
            event_category: 'performance'
          });
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  };

  // Inicializar mediciones
  measureLCP();
  measureFID();
  measureCLS();
}

// Optimización de bundle splitting dinámico
export function loadComponentDynamically<T>(
  importFn: () => Promise<T>,
  fallback?: React.ComponentType,
  retries = 3
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attemptLoad = (attempt: number) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          console.error(`❌ Error cargando componente (intento ${attempt}):`, error);
          
          if (attempt < retries) {
            // Retry con backoff exponencial
            setTimeout(() => attemptLoad(attempt + 1), Math.pow(2, attempt) * 1000);
          } else {
            // Si falla todo, usar fallback si existe
            if (fallback) {
              resolve({ default: fallback } as T);
            } else {
              reject(error);
            }
          }
        });
    };
    
    attemptLoad(1);
  });
}

// Optimización de scroll virtual para listas grandes
export function createVirtualScrollManager(
  containerHeight: number,
  itemHeight: number,
  buffer = 3
) {
  return {
    getVisibleRange(scrollTop: number, totalItems: number) {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
      const endIndex = Math.min(
        totalItems - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
      );
      
      return { startIndex, endIndex };
    },
    
    getTotalHeight(totalItems: number) {
      return totalItems * itemHeight;
    },
    
    getOffsetY(startIndex: number) {
      return startIndex * itemHeight;
    }
  };
}

// Batch updates para mejor performance en cambios de estado
export function batchUpdates<T>(
  updates: Array<() => void>,
  delay = 16 // Un frame a 60fps
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Usar unstable_batchedUpdates si está disponible (React 18+)
      if ('unstable_batchedUpdates' in React) {
        (React as any).unstable_batchedUpdates(() => {
          updates.forEach(update => update());
        });
      } else {
        updates.forEach(update => update());
      }
      resolve();
    }, delay);
  });
}

// Performance monitoring para desarrollo
export const performanceMonitor = {
  mark(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },
  
  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
      } catch (error) {
        console.warn('Error midiendo performance:', error);
      }
    }
    return 0;
  },
  
  clearMarks() {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  }
};