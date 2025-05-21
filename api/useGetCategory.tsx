import { useEffect, useState } from "react";

export function useGetCategory() {
const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  (async () => {
    try {
      console.log("Fetch URL:", url);
      const res = await fetch(url);
      console.log("Status:", res.status, res.statusText);
      if (!res.ok) {
        setError(`Error HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      const json = await res.json();
      console.log("Data:", json);
      setResult(json.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || "Error desconocido");
      setLoading(false);
    }
  })();
}, [url]);


  return { loading, result, error };
}