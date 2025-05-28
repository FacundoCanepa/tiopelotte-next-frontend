import { useEffect, useState } from "react"
import { Category } from "@/types/category" // agregá esto si no estaba

export function useGetCategory() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`
  const [result, setResult] = useState<Category[]>([]) // cambio clave
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(url)
        const json = await res.json()
        setResult(json.data)
        setLoading(false)
      } catch (error: any) {
        setError(error.message || "Error desconocido")
      }
    })()
  }, [url])

  return { loading, result, error }
}
