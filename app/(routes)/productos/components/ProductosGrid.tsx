import ProductGridCard from "./ProductGridCard"
import SkeletonSchema from "@/components/ui/skeletonSchema"
import { ProductType } from "@/types/product"

interface Props {
  products: ProductType[]
  loading: boolean
}

const ProductosGrid = ({ products, loading }: Props) => {
  if (loading) return <SkeletonSchema count={3}/>

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10">
      {products.map((product) => (
        <ProductGridCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductosGrid