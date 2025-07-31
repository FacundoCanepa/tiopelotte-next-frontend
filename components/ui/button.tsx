import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Componente Button mejorado con micro-interactions
 * Manteniendo compatibilidad hacia atrás pero con mejoras de UX
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-[#6B8E23] text-white hover:bg-[#5A7A1E] active:bg-[#4F6B1A] shadow-sm hover:shadow-md focus:ring-4 focus:ring-[#6B8E23]/30",
        secondary: "bg-[#FECB89] text-stone-900 border border-amber-300 hover:bg-[#FDB456] active:bg-[#FC9F23] shadow-sm hover:shadow-md focus:ring-4 focus:ring-amber-200",
        outline: "border-2 border-stone-400 text-stone-900 bg-transparent hover:bg-stone-400 hover:text-white active:bg-stone-500 focus:ring-4 focus:ring-stone-200",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer focus:outline-none relative overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        buttonVariants({ variant, size }), 
        className
      )}
      {...props}
    >
      {/* Ripple effect sutil */}
      <span className="absolute inset-0 bg-white/10 rounded-full opacity-0 transition-opacity duration-200 hover:opacity-100" />
      
      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {props.children}
      </span>
    </button>
  );
};

export default Button;