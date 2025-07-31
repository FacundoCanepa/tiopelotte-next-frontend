"use client";

import {
 * Gráfico de ventas profesional optimizado para dashboard
 * 
 * Mejoras implementadas:
 * - Diseño visual más atractivo con gradientes
 * - Tooltips personalizados con formato argentino
 * - Animaciones suaves al cargar
 * - Responsive design mejorado
 * - Colores coherentes con la marca
 */

"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Tooltip, 
  Legend, 
  Filler
);

interface Props {
  labels: string[];
  values: number[];
}

export default function VentasChart({ labels, values }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: "Ventas Mensuales",
        data: values,
        borderColor: "#D16A45",
        backgroundColor: "rgba(209, 106, 69, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#D16A45",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    layout: {
      padding: 20,
    },
    plugins: {
      legend: { 
        display: true,
        position: 'top' as const,
        labels: {
          color: "#5A3E1B",
          font: { 
            family: "EB Garamond", 
            size: 14,
            weight: 600
          },
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: "#5A3E1B",
        titleColor: "#FFF8EC",
        bodyColor: "#FFF8EC",
        cornerRadius: 12,
        padding: 16,
        titleFont: {
          family: "EB Garamond",
          size: 16,
          weight: 600
        },
        bodyFont: {
          family: "EB Garamond", 
          size: 14
        },
        callbacks: {
          label: function(context: any) {
            return `Ventas: $${context.parsed.y.toLocaleString("es-AR")}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#5A3E1B",
          font: { 
            family: "EB Garamond", 
            size: 13,
            weight: 500
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(90, 62, 27, 0.1)",
          borderDash: [5, 5],
        },
        ticks: {
          color: "#5A3E1B",
          font: { 
            family: "EB Garamond", 
            size: 12,
            weight: 500
          },
          callback: function(value: any) {
            return `$${value.toLocaleString("es-AR")}`;
          }
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      }
    },
  } as const;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E6D2B5] p-6 h-[450px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#8B4513] font-garamond">
            📈 Evolución de Ventas
          </h2>
          <p className="text-sm text-[#5A3E1B] mt-1">
            Solo se contabilizan pedidos con estado <strong>Entregado</strong>
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-[#8B4513] font-medium">Total del período</p>
          <p className="text-xl font-bold text-[#D16A45] font-garamond">
            ${values.reduce((a, b) => a + b, 0).toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <div className="h-[320px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
