export type PedidoItem = {
  img: string;
  slug: string;
  quantity: number;
  productId: number;
  unitPrice: number;
  productName: string;
  unidadMedida: string;
};

export type PedidoType = {
  id: number;
  documentId: string;
  items: PedidoItem[];
  total: number;
  estado: "En camino " | "Pendiente" | "Entregado" | "Cancelado";
  zona: string;
  direccion: string;
  referencias: string;
  telefono: string;
  nombreApellido: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }[];
};
