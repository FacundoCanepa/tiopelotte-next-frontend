"use client";

import { useEffect, useState } from "react";

interface Props {
  labels: string[];
  values: number[];
}

/**
 * Componente de gráfico optimizado para producción
 * Carga Chart.js de forma asíncrona para evitar errores SSR
 */
export default function VentasChart({ labels, values }: Props) {
  const [ChartComponent, setChartComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadChart = async () => {
      try {
        // Verificar que estamos en el cliente
        if (typeof window === 'undefined') return;

        // Importar Chart.js y react-chartjs-2 dinámicamente
        const [
          {
            Chart as ChartJS,
            CategoryScale,
            LinearScale,
            BarElement,
            LineElement,
            PointElement,
            Tooltip,
            Legend,
            Filler,
          },
          { Line }
        ] = await Promise.all([
          import("chart.js"),
          import("react-chartjs-2")
        ]);

        // Registrar componentes necesarios
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

        // Configurar defaults
        ChartJS.defaults.responsive = true;
        ChartJS.defaults.maintainAspectRatio = false;
        ChartJS.defaults.font = {
          family: 'EB Garamond, serif',
          size: 14,
        };

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
              pointHoverBackgroundColor: "#B8472E",
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
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            },
          },
          plugins: {
            legend: { 
              display: true,
              position: 'top' as const,
              labels: {
                color: "#5A3E1B",
                font: { 
                  family: "EB Garamond, serif", 
                  size: 16,
                  weight: '600'
                },
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
              }
            },
            tooltip: {
              backgroundColor: "rgba(90, 62, 27, 0.95)",
              titleColor: "#FFF8EC",
              bodyColor: "#FFF8EC",
              borderColor: "#FFD966",
              borderWidth: 1,
              cornerRadius: 12,
              padding: 16,
              titleFont: {
                family: "EB Garamond, serif",
                size: 16,
                weight: '600'
              },
              bodyFont: {
                family: "EB Garamond, serif", 
                size: 14
              },
              callbacks: {
                label: function(context: any) {
                  return `Ventas: $${context.parsed.y.toLocaleString("es-AR")}`;
                },
                title: function(context: any) {
                  return `Período: ${context[0].label}`;
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
                  family: "EB Garamond, serif", 
                  size: 13,
                  weight: '500'
                },
                maxRotation: 45,
              },
              title: {
                display: true,
                text: 'Período',
                color: "#5A3E1B",
                font: {
                  family: "EB Garamond, serif",
                  size: 14,
                  weight: '600'
                }
              }
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
                  family: "EB Garamond, serif", 
                  size: 12,
                  weight: '500'
                },
                callback: function(value: any) {
                  return `$${Number(value).toLocaleString("es-AR")}`;
                }
              },
              title: {
                display: true,
                text: 'Ventas (ARS)',
                color: "#5A3E1B",
                font: {
                  family: "EB Garamond, serif",
                  size: 14,
                  weight: '600'
                }
              }
            },
          },
          elements: {
            point: {
              hoverBorderWidth: 3,
            },
            line: {
              borderCapStyle: 'round' as const,
              borderJoinStyle: 'round' as const,
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart' as const,
          }
        };

        // Crear componente del gráfico
        const ChartComponentWrapper = () => (
          <Line options={options} data={data} />
        );

        setChartComponent(() => ChartComponentWrapper);
      } catch (error) {
        console.error("Error cargando Chart.js:", error);
        setError("No se pudo cargar el gráfico de ventas.");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(loadChart, 100);
    return () => clearTimeout(timeoutId);
  }, [labels, values]);

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
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-600">
              <p className="font-semibold">⚠️ {error}</p>
              <p className="text-sm mt-1">Los datos están disponibles en la tabla</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#8B4513] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-[#8B4513]">Cargando gráfico...</p>
            </div>
          </div>
        ) : ChartComponent ? (
          <ChartComponent />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-600">
              <p>📊 Gráfico no disponible</p>
              <p className="text-sm mt-1">Consultá los datos en la tabla</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}