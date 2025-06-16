"use client";

import { useConfirmPedido } from "./hook/useConfirmPedido";
import SuccessLayout from "./components/SuccessLayout";
import SuccessMessage from "./components/SuccessMessage";
import SuccessActions from "./components/SuccessActions";

export default function CheckoutSuccessPage() {
  const { estado } = useConfirmPedido();

  return (
    <SuccessLayout>
      <SuccessMessage estado={estado} />
      <SuccessActions />
    </SuccessLayout>
  );
}