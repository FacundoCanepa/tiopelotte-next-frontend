interface Props {
  totalPages: number
  currentPage: number
  setPage: (page: number) => void
}

const ProductosPagination = ({ totalPages, currentPage, setPage }: Props) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-10 gap-4">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-4 py-2 rounded border font-medium transition-colors duration-200 ${
            currentPage === i + 1
              ? "bg-[#FFD966] text-[#8B4513]"
              : "bg-white text-[#8B4513] border-[#8B4513] hover:bg-[#FFF4E3]"
          } cursor-pointer`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

export default ProductosPagination