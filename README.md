# 🍝 TÍO PELOTTE - Pastas Artesanales

Aplicación web completa para e-commerce de pastas artesanales desarrollada con Next.js 15, optimizada para producción en Vercel.

## 🚀 **GUÍA DE DESPLIEGUE EN VERCEL**

### **Paso 1: Preparación del Repositorio**

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd tio-pelotte-frontend

# Instalar dependencias
npm ci

# Verificar que el build funciona localmente
npm run build
```

### **Paso 2: Configuración de Variables de Entorno**

1. **Copia el archivo de ejemplo:**
```bash
cp .env.example .env.local
```

2. **Configura las variables requeridas:**
```env
NEXT_PUBLIC_BACKEND_URL=https://tu-backend-strapi.com
NEXT_PUBLIC_MEDIA_URL=https://tu-backend-strapi.com
NEXT_PUBLIC_FRONTEND_URL=https://tu-dominio.vercel.app
STRAPI_API_TOKEN=tu_token_de_strapi
STRAPI_PEDIDOS_TOKEN=tu_token_de_pedidos
MP_ACCESS_TOKEN=tu_access_token_mercadopago
```

### **Paso 3: Despliegue en Vercel**

#### **Opción A: Desde la CLI de Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel --prod
```

#### **Opción B: Desde GitHub (Recomendado)**

1. **Conecta tu repositorio a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el repositorio

2. **Configura las variables de entorno en Vercel:**
   - Ve a Settings > Environment Variables
   - Agrega todas las variables del archivo `.env.example`
   - Asegúrate de marcar las variables `NEXT_PUBLIC_*` para todos los entornos

3. **Configura el dominio personalizado (opcional):**
   - Ve a Settings > Domains
   - Agrega tu dominio personalizado

### **Paso 4: Verificación Post-Despliegue**

✅ **Checklist de verificación:**

- [ ] La página principal carga correctamente
- [ ] Los productos se muestran desde Strapi
- [ ] El carrito funciona (agregar/quitar productos)
- [ ] El proceso de checkout completo funciona
- [ ] Los mapas de entrega cargan correctamente
- [ ] El panel de administración es accesible
- [ ] Las imágenes se cargan desde Strapi
- [ ] Los formularios de contacto funcionan
- [ ] El SEO está configurado (meta tags, sitemap)
- [ ] PWA funciona (manifest, service worker)

## 🛠 **DESARROLLO LOCAL**

### **Requisitos del Sistema**
- Node.js 18.17.0 o superior
- npm 9.0.0 o superior

### **Instalación**
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Ejecutar en desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Verificar código
npm run lint:fix     # Corregir errores de lint
npm run type-check   # Verificar TypeScript
npm run clean        # Limpiar cache y node_modules
npm run analyze      # Analizar bundle size
```

## 🏗 **ARQUITECTURA DEL PROYECTO**

```
├── app/                    # App Router de Next.js 15
│   ├── (routes)/          # Rutas agrupadas
│   ├── api/               # API Routes
│   ├── admin/             # Panel administrativo
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   ├── sections/         # Secciones de página
│   ├── layout/           # Layout components
│   └── hooks/            # Custom hooks
├── lib/                  # Utilidades y configuración
├── store/                # Estado global (Zustand)
├── types/                # Definiciones TypeScript
└── public/               # Assets estáticos
```

## 🔧 **TECNOLOGÍAS PRINCIPALES**

- **Framework:** Next.js 15.3.1 (App Router)
- **React:** 18.3.1
- **TypeScript:** 5.7.2
- **Styling:** Tailwind CSS 4.0
- **Estado:** Zustand 5.0.5
- **UI Components:** Radix UI + Custom
- **Maps:** React Leaflet 4.2.1
- **Charts:** Chart.js + React Chart.js 2
- **Carousel:** Embla Carousel 8.6.0
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Payments:** MercadoPago SDK

## 🚨 **TROUBLESHOOTING COMÚN**

### **Error: "Module not found" con leaflet**
```bash
# Limpiar cache y reinstalar
npm run clean
npm install
```

### **Error: "Hydration failed"**
- Verificar que todos los componentes con `useState` tengan `"use client"`
- Revisar que no haya diferencias entre SSR y cliente

### **Error: "Chart.js not loading"**
- Los gráficos se cargan dinámicamente, verificar conexión a internet
- En desarrollo, puede tardar unos segundos en cargar

### **Error: Variables de entorno no definidas**
```bash
# Verificar que .env.local existe y tiene todas las variables
cat .env.local

# En Vercel, verificar Environment Variables en Settings
```

### **Error: "Build failed" en Vercel**
- Verificar que todas las variables de entorno están configuradas
- Revisar los logs de build en Vercel Dashboard
- Asegurar que el backend Strapi esté accesible

## 📊 **OPTIMIZACIONES DE PERFORMANCE**

### **Implementadas:**
- ✅ Image optimization con Next.js Image
- ✅ Code splitting automático
- ✅ Lazy loading de componentes pesados
- ✅ Caching de requests API
- ✅ Bundle optimization
- ✅ Font optimization
- ✅ Static generation donde es posible

### **Métricas Objetivo:**
- **LCP:** < 2.5s
- **FID:** < 100ms  
- **CLS:** < 0.1
- **Lighthouse Score:** > 90

## 🔒 **SEGURIDAD**

### **Headers de Seguridad Configurados:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### **Buenas Prácticas:**
- Variables sensibles solo en servidor
- Validación de datos en cliente y servidor
- Sanitización de inputs
- Rate limiting en API routes

## 📱 **PWA (Progressive Web App)**

La aplicación incluye funcionalidad PWA:
- Manifest configurado
- Service Worker automático (Next.js)
- Instalable en dispositivos móviles
- Funciona offline (cache básico)

## 🤝 **CONTRIBUCIÓN**

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📞 **SOPORTE**

Para problemas técnicos o consultas sobre el despliegue:
- Revisar la documentación de [Next.js](https://nextjs.org/docs)
- Consultar la [documentación de Vercel](https://vercel.com/docs)
- Verificar los logs en Vercel Dashboard

---

**Desarrollado con ❤️ para TÍO PELOTTE - Las pastas de tu pueblo**