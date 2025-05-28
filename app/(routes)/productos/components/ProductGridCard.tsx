"use client"

import { useRouter } from "next/navigation"
import { ProductType } from "@/types/product"
import { Card, CardContent } from "@/components/ui/card"
import Button from "@/components/ui/Button"

interface Props {
  product: ProductType
}

const ProductGridCard = ({ product }: Props) => {
  const router = useRouter()

  return (
    <Card className="bg-[#FFF4E3] border-none rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full">
      <CardContent className="flex flex-col justify-between h-full p-4">
        <div className="overflow-hidden rounded-xl h-[21rem] md:h-48 w-full">
          <img
            src={product.img?.[0]?.url || "/placeholder.jpg"}
            alt={product.productName}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col flex-grow justify-between gap-2 mt-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-garamond italic text-[#8B4513]">
              {product.productName}
            </h3>

            <p className="text-sm text-stone-600">
              {product.description}
            </p>

            <span className="text-[#D16A45] font-semibold text-base">
              ${product.price} <span className="text-sm text-stone-500">/{product.unidadMedida}</span>
            </span>
          </div>

          <Button
            onClick={() => router.push(`/productos/${product.slug}`)}
            className="bg-[#FFD966] text-[#8B4513] hover:bg-[#6B8E23] mt-2"
          >
            Ver más
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductGridCard
