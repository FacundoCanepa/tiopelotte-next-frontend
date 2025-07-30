// Utilidades para optimización de rendimiento

// Debounce para optimizar búsquedas y filtros
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle para optimizar scroll y resize
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy loading de imágenes
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' }
  );
  
  observer.observe(img);
}

// Preload de recursos críticos
export function preloadResource(href: string, as: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Optimización de Web Vitals
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Aquí puedes enviar métricas a tu servicio de analytics
    console.log(metric);
  }
}

// Cache para requests de API
class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutos

  get(key: string) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.ttl) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new APICache();

// Optimización de bundle splitting
export function loadComponent(importFn: () => Promise<any>) {
  return importFn().catch((error) => {
    console.error('Error loading component:', error);
    return { default: () => null };
  });
}