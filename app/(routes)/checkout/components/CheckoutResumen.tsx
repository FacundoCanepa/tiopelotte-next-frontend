"use client";

interface Props {
  subtotal: number;
  envio: number;
  total: number;
}

export default function CheckoutResumen({ subtotal, envio, total }: Props) {
  return (
    <div className="space-y-1 text-right">
      <p className="text-lg font-semibold text-[#5A3E1B]">
        Subtotal: ${subtotal.toLocaleString("es-AR")}
      </p>
      <p className="text-lg font-semibold text-[#5A3E1B]">
        Costo de envío: {envio ? `$${envio.toLocaleString("es-AR")}` : "$0"}
      </p>
      <p className="text-lg font-semibold text-[#5A3E1B]">
        Total: ${total.toLocaleString("es-AR")}
      </p>
    </div>
  );
}
