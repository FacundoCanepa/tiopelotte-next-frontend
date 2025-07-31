"use client"

"use client"

import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import { useEffect } from "react";

interface Props {
  value: string
  setValue: (val: string) => void
}

const SearchInput = ({ value, setValue }: Props) => {
  const { trackSearch } = useGoogleAnalytics();

  useEffect(() => {
    if (value.length >= 3) {
      const timeoutId = setTimeout(() => {
        trackSearch(value);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [value, trackSearch]);

  return (
    <input
      type="text"
      placeholder="Buscar producto..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="text-sm px-3 py-2 border rounded w-full"
    />
  );
};

export default SearchInput
