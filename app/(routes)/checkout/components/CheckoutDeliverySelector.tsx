"use client";

interface Props {
  tipoEntrega: "domicilio" | "local";
  setTipoEntrega: (val: "domicilio" | "local") => void;
}

export default function CheckoutDeliverySelector({ tipoEntrega, setTipoEntrega }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#5A3E1B] mb-1">
        Método de entrega
      </label>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            value="domicilio"
            checked={tipoEntrega === "domicilio"}
            onChange={() => setTipoEntrega("domicilio")}
            className="accent-[#8B4513]"
          />
          Entrega a domicilio
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            value="local"
            checked={tipoEntrega === "local"}
            onChange={() => setTipoEntrega("local")}
            className="accent-[#8B4513]"
          />
          Retiro en el local
        </label>
      </div>
    </div>
  );
}