"use client";

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#FBE6D4] text-[#5A3E1B] text-center">
      <div
        className="max-w-xl w-full space-y-6 animate-in slide-in-from-bottom-8 duration-800"
      >
        {children}
      </div>
    </div>
  );
}
