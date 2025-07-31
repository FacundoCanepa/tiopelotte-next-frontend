/**
 * Dashboard administrativo profesional optimizado para Tío Pelotte
 * 
 * Características implementadas:
 * - Métricas en tiempo real con visualizaciones avanzadas
 * - Filtros inteligentes para análisis de datos
 * - Gráficos interactivos con Chart.js
 * - Diseño modular y escalable
 * - Responsive design optimizado
 * - Estados de loading profesionales
 */

"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  HandCoins,
  HelpCircle,
  Store,
  Ban,
  TrendingUp,
  Package,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import ResumenCard from "./ResumenCard";
import PedidosTable from "./PedidosTable";
import VentasChart from "./VentasChart";
import BestSellingProducts from "./BestSellingProducts";


interface Pedido {
  id: number;
  documentId: string;
  estado: string;
  total: number;
  tipoPago: string;
  tipoEntrega: string;
  createdAt: string;
  telefono: string;
  nombre: string;
  items: {
    title: string;
    quantity: number;
    product_name: string;
  }[];
}

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados de filtros mejorados
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [ordenFecha, setOrdenFecha] = useState<string>("recientes");
  const [ordenPrecio, setOrdenPrecio] = useState<string>("ninguno");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [filtroEntrega, setFiltroEntrega] = useState<string>("Todos");
  const [filtroPago, setFiltroPago] = useState<string>("Todos");
  const [periodoAnalisis, setPeriodoAnalisis] = useState<string>("mes");

  const fetchPedidos = async () => {
    try {
      const res = await fetch("/api/pedidos?populate=*");
      const json = await res.json();
      setPedidos(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPedidos();
  };

  // Aplicar filtros de fecha inteligente
  const aplicarFiltroFecha = (pedidos: Pedido[]) => {
    const ahora = new Date();
    let fechaInicio: Date;

    switch (periodoAnalisis) {
      case "semana":
        fechaInicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "mes":
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        break;
      case "trimestre":
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 3, 1);
        break;
      case "año":
        fechaInicio = new Date(ahora.getFullYear(), 0, 1);
        break;
      default:
        return pedidos;
    }

    return pedidos.filter(p => new Date(p.createdAt) >= fechaInicio);
  };

  // Filtros aplicados
  const pedidosFiltrados = pedidos.filter((p) => {
    const fecha = new Date(p.createdAt);
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;
    return (
      (filtroEstado === "Todos" || p.estado === filtroEstado) &&
      (!desde || fecha >= desde) &&
      (!hasta || fecha <= hasta)
    );
  });

  // Ordenamiento optimizado
  let pedidosOrdenados = [...pedidosFiltrados];

  if (ordenFecha === "recientes") {
    pedidosOrdenados.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (ordenFecha === "antiguos") {
    pedidosOrdenados.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  if (ordenPrecio === "mayor") {
    pedidosOrdenados.sort((a, b) => b.total - a.total);
  } else if (ordenPrecio === "menor") {
    pedidosOrdenados.sort((a, b) => a.total - b.total);
  }

  // Métricas con filtros aplicados
  const resumenFiltrado = aplicarFiltroFecha(pedidos).filter((p) => {
    return (
      (filtroEntrega === "Todos" || p.tipoEntrega === filtroEntrega) &&
      (filtroPago === "Todos" || p.tipoPago?.toLowerCase() === filtroPago.toLowerCase())
    );
  });

  const entregados = resumenFiltrado.filter((p) => p.estado === "Entregado");
  const pendientes = resumenFiltrado.filter((p) => p.estado === "Pendiente");
  const enCamino = resumenFiltrado.filter((p) => p.estado === "En camino");
  const cancelados = resumenFiltrado.filter((p) => p.estado === "Cancelado");

  const totalVendido = entregados.reduce((acc, p) => acc + p.total, 0);
  const promedioVenta = entregados.length > 0 ? totalVendido / entregados.length : 0;
  const ventasHoy = entregados.filter(p => {
    const hoy = new Date().toDateString();
    return new Date(p.createdAt).toDateString() === hoy;
  }).length;

  // Métricas de métodos de pago
  const porMercadoPago = resumenFiltrado.filter((p) => p.tipoPago?.toLowerCase() === "mercado pago").length;
  const porEfectivo = resumenFiltrado.filter((p) => p.tipoPago === "efectivo").length;
  const porAElegir = resumenFiltrado.filter((p) => p.tipoPago?.toLowerCase().includes("elegís")).length;

  // Métricas de entrega
  const porDomicilio = resumenFiltrado.filter((p) => p.tipoEntrega === "domicilio").length;
  const porLocal = resumenFiltrado.filter((p) => p.tipoEntrega === "local").length;

  // Datos para gráfico de ventas mensuales (solo entregados)
  const monthly: Record<string, number> = {};
  entregados.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthly[key] = (monthly[key] || 0) + p.total;
  });

  const labels = Object.keys(monthly).sort().map((k) => {
    const [y, m] = k.split("-").map(Number);
    return new Date(y, m).toLocaleString("es-AR", { month: "short", year: "2-digit" });
  });

  const values = Object.keys(monthly).sort().map((k) => monthly[k]);

  // Función para exportar datos
  const exportarDatos = () => {
    const csvContent = [
      "Fecha,Cliente,Total,Estado,Pago,Entrega,Teléfono",
      ...pedidosOrdenados.map(p => 
        `${new Date(p.createdAt).toLocaleDateString("es-AR")},${p.nombre},$${p.total},${p.estado},${p.tipoPago},${p.tipoEntrega},${p.telefono}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#8B4513] mx-auto" />
          <p className="text-[#5A3E1B] text-lg font-garamond">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#FBE6D4] min-h-screen p-6">
      {/* Header mejorado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-2xl p-6 shadow-lg border border-[#E6D2B5]">
        <div>
          <h1 className="text-4xl font-bold text-[#8B4513] font-garamond flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            Dashboard Económico
          </h1>
          <p className="text-[#5A3E1B] mt-2">
            Vista general del rendimiento del negocio - Período: {periodoAnalisis}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFD966] text-[#5A3E1B] rounded-lg hover:bg-[#F5C741] transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
          
          <button
            onClick={exportarDatos}
            className="flex items-center gap-2 px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5A7A1E] transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Selector de período de análisis */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-[#E6D2B5]">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-[#8B4513]" />
          <h3 className="font-semibold text-[#8B4513]">Período de Análisis</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "semana", label: "Última Semana" },
            { value: "mes", label: "Este Mes" },
            { value: "trimestre", label: "Último Trimestre" },
            { value: "año", label: "Este Año" }
          ].map(periodo => (
            <button
              key={periodo.value}
              onClick={() => setPeriodoAnalisis(periodo.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                periodoAnalisis === periodo.value
                  ? 'bg-[#FFD966] text-[#5A3E1B] shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {periodo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas principales mejoradas */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResumenCard 
          title="Ventas Totales" 
          value={`$${totalVendido.toLocaleString("es-AR")}`} 
          icon={<DollarSign className="h-8 w-8" />}
          subtitle={`${entregados.length} pedidos entregados`}
          color="bg-green-500"
        />
        <ResumenCard 
          title="Promedio por Venta" 
          value={`$${Math.round(promedioVenta).toLocaleString("es-AR")}`} 
          icon={<TrendingUp className="h-8 w-8" />}
          subtitle="Ticket promedio"
          color="bg-blue-500"
        />
        <ResumenCard 
          title="Ventas Hoy" 
          value={ventasHoy} 
          icon={<Calendar className="h-8 w-8" />}
          subtitle="Pedidos del día"
          color="bg-purple-500"
        />
        <ResumenCard 
          title="Total Pedidos" 
          value={resumenFiltrado.length} 
          icon={<Package className="h-8 w-8" />}
          subtitle="En período seleccionado"
          color="bg-orange-500"
        />
      </section>

      {/* Gráfico de ventas mejorado */}
      <VentasChart labels={labels} values={values} />

      {/* Filtros de pedidos mejorados */}
      <section className="bg-white rounded-xl p-6 shadow-lg border border-[#E6D2B5]">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#8B4513]" />
          <h2 className="text-xl font-semibold text-[#8B4513]">Filtros Avanzados de Pedidos</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)} 
            className="border border-[#E6D2B5] p-3 rounded-lg bg-white text-[#5A3E1B] focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
          >
            <option value="Todos">📋 Estado: Todos</option>
            <option value="Pendiente">⏳ Pendientes</option>
            <option value="En camino">🚚 En camino</option>
            <option value="Entregado">✅ Entregados</option>
            <option value="Cancelado">❌ Cancelados</option>
          </select>
          
          <select 
            value={ordenFecha} 
            onChange={(e) => setOrdenFecha(e.target.value)} 
            className="border border-[#E6D2B5] p-3 rounded-lg bg-white text-[#5A3E1B] focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
          >
            <option value="recientes">📅 Más recientes</option>
            <option value="antiguos">📅 Más antiguos</option>
          </select>
          
          <select 
            value={ordenPrecio} 
            onChange={(e) => setOrdenPrecio(e.target.value)} 
            className="border border-[#E6D2B5] p-3 rounded-lg bg-white text-[#5A3E1B] focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
          >
            <option value="ninguno">💰 Sin ordenar</option>
            <option value="mayor">💰 Mayor precio</option>
            <option value="menor">💰 Menor precio</option>
          </select>
          
          <input 
            type="date" 
            value={fechaDesde} 
            onChange={(e) => setFechaDesde(e.target.value)} 
            className="border border-[#E6D2B5] p-3 rounded-lg bg-white text-[#5A3E1B] focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
            placeholder="Fecha desde"
          />
          
          <input 
            type="date" 
            value={fechaHasta} 
            onChange={(e) => setFechaHasta(e.target.value)} 
            className="border border-[#E6D2B5] p-3 rounded-lg bg-white text-[#5A3E1B] focus:ring-2 focus:ring-[#FFD966] focus:border-transparent"
            placeholder="Fecha hasta"
          />
          
          <button
            onClick={() => {
              setFiltroEstado("Todos");
              setOrdenFecha("recientes");
              setOrdenPrecio("ninguno");
              setFechaDesde("");
              setFechaHasta("");
            }}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            🔄 Limpiar
          </button>
        </div>
      </section>

      {/* Tabla de pedidos mejorada */}
      <PedidosTable pedidos={pedidosOrdenados.slice(0, 20)} />

      {/* Métricas de estados mejoradas */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#8B4513] flex items-center gap-2">
          <Package className="w-6 h-6" />
          Estados de Pedidos - {periodoAnalisis}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <ResumenCard 
            title="Entregados" 
            value={entregados.length} 
            icon={<CheckCircle className="h-6 w-6" />}
            subtitle={`$${entregados.reduce((acc, p) => acc + p.total, 0).toLocaleString("es-AR")}`}
            color="bg-green-500"
          />
          <ResumenCard 
            title="En Camino" 
            value={enCamino.length} 
            icon={<Truck className="h-6 w-6" />}
            subtitle={`$${enCamino.reduce((acc, p) => acc + p.total, 0).toLocaleString("es-AR")}`}
            color="bg-blue-500"
          />
          <ResumenCard 
            title="Pendientes" 
            value={pendientes.length} 
            icon={<Clock className="h-6 w-6" />}
            subtitle={`$${pendientes.reduce((acc, p) => acc + p.total, 0).toLocaleString("es-AR")}`}
            color="bg-yellow-500"
          />
          <ResumenCard 
            title="Cancelados" 
            value={cancelados.length} 
            icon={<Ban className="h-6 w-6" />}
            subtitle={`$${cancelados.reduce((acc, p) => acc + p.total, 0).toLocaleString("es-AR")}`}
            color="bg-red-500"
          />
          <ResumenCard 
            title="Tasa Éxito" 
            value={`${resumenFiltrado.length > 0 ? Math.round((entregados.length / resumenFiltrado.length) * 100) : 0}%`} 
            icon={<TrendingUp className="h-6 w-6" />}
            subtitle="Pedidos completados"
            color="bg-purple-500"
          />
        </div>
      </section>

      {/* Métricas de métodos de pago */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#8B4513] flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Métodos de Pago
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResumenCard 
            title="Mercado Pago" 
            value={porMercadoPago} 
            icon={<CreditCard className="h-6 w-6" />}
            subtitle={`${resumenFiltrado.length > 0 ? Math.round((porMercadoPago / resumenFiltrado.length) * 100) : 0}% del total`}
            color="bg-blue-500"
          />
          <ResumenCard 
            title="Efectivo" 
            value={porEfectivo} 
            icon={<HandCoins className="h-6 w-6" />}
            subtitle={`${resumenFiltrado.length > 0 ? Math.round((porEfectivo / resumenFiltrado.length) * 100) : 0}% del total`}
            color="bg-green-500"
          />
          <ResumenCard 
            title="A Elección" 
            value={porAElegir} 
            icon={<HelpCircle className="h-6 w-6" />}
            subtitle={`${resumenFiltrado.length > 0 ? Math.round((porAElegir / resumenFiltrado.length) * 100) : 0}% del total`}
            color="bg-orange-500"
          />
        </div>
      </section>

      {/* Métricas de tipo de entrega */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#8B4513] flex items-center gap-2">
          <Truck className="w-6 h-6" />
          Tipos de Entrega
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResumenCard 
            title="Domicilio" 
            value={porDomicilio} 
            icon={<Truck className="h-6 w-6" />}
            subtitle={`${resumenFiltrado.length > 0 ? Math.round((porDomicilio / resumenFiltrado.length) * 100) : 0}% del total`}
            color="bg-blue-500"
          />
          <ResumenCard 
            title="Retiro en Local" 
            value={porLocal} 
            icon={<Store className="h-6 w-6" />}
            subtitle={`${resumenFiltrado.length > 0 ? Math.round((porLocal / resumenFiltrado.length) * 100) : 0}% del total`}
            color="bg-green-500"
          />
        </div>
      </section>

      {/* Productos más vendidos */}
      <BestSellingProducts pedidos={resumenFiltrado} />
    </div>
  );
}