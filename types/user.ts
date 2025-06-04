import { PedidoType } from "./pedido";

export type UserType = {
  id: number;
  username: string;
  email: string;
  jwt: string;
  pedidos?: PedidoType[];
};
