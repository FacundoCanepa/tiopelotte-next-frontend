import { ItemType } from "./item";

export type PedidoType = {
  id: number;
  documentId?: string;
  items: ItemType[];
  total: number;
  estado: string;
  zona: string;
  direccion: string;
  referencias?: string;
  telefono?: string;
  nombreApellido?: string;
  createdAt: string;
};