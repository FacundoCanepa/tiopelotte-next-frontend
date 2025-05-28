import { useEffect, useState } from "react"
import { ProductType } from "@/types/product"

interface ProductsResult {
  products: ProductType[]
  total: number
  loading: boolean
}

export function useGetProductsBy(filter: Record<string, unknown>): ProductsResult {
  const [products, setProducts] = useState<ProductType[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams(
          Object.entries(filter).map(([key, value]) => [key, String(value)])
        ).toString()

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${query}`)
        const data = await res.json()
        
        await new Promise((res) => setTimeout(res, 100))

        setProducts(data.data || [])
        setTotal(data.meta?.pagination?.total || 0)
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [JSON.stringify(filter)])

  return { products, total, loading }
}
