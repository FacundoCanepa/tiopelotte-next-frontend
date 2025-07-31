"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary profesional para capturar errores en producción
 * Incluye logging automático y UI de recuperación
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error para monitoreo
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // En producción, enviar error a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // Aquí se podría integrar con Sentry, LogRocket, etc.
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Implementar logging a servicio externo
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Ejemplo: enviar a endpoint de logging
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
    }).catch(console.error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI personalizada de error
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FBE6D4] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#8B4513] mb-2">
                ¡Ups! Algo salió mal
              </h1>
              <p className="text-gray-600 text-sm">
                Ocurrió un error inesperado. Nuestro equipo ha sido notificado.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-[#FFD966] hover:bg-[#F5C741] text-[#8B4513] px-4 py-3 rounded-xl font-semibold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Intentar nuevamente
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 border border-[#8B4513] text-[#8B4513] hover:bg-[#FBE6D4] px-4 py-3 rounded-xl font-semibold transition-colors"
              >
                <Home className="w-4 h-4" />
                Ir al inicio
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Si el problema persiste, contactanos por WhatsApp
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Boundary específico para secciones de productos
export function ProductErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Error cargando productos
          </h3>
          <p className="text-red-600 text-sm mb-4">
            No pudimos cargar los productos. Por favor, recargá la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Recargar página
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Error Boundary para el carrito
export function CartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">
            Error en el carrito
          </h3>
          <p className="text-yellow-600 text-sm mb-4">
            Hubo un problema con tu carrito. Los datos se han guardado.
          </p>
          <button
            onClick={() => window.location.href = '/cart'}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Ir al carrito
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}