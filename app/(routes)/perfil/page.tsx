import ComprasRecientes from "./components/ComprasRecientes";

export default function Perfil() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Mi Perfil</h1>
      <ComprasRecientes />
    </div>
  );
}