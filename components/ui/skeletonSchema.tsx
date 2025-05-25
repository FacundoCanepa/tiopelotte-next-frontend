import { Skeleton } from "./skeleton";

type SkeletonCarouselProps = {
  count: number;
};

const SkeletonCarousel = ({ count }: SkeletonCarouselProps) => {
  return (
    <div className="flex overflow-hidden gap-4 px-2 sm:px-4 md:px-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
        >
          <div className="relative bg-white/30 backdrop-blur-2xl rounded-xl shadow-md flex flex-col h-full p-3 md:p-4 gap-4">
            {/* Imagen */}
            <div className="relative w-full h-[17rem] overflow-hidden rounded-xl">
              <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
            </div>

            {/* Título */}
            <Skeleton className="h-5 w-3/4 rounded" />

            {/* Descripción */}
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />

            {/* Botón */}
            <div className="mt-auto">
              <Skeleton className="h-10 w-[70%] rounded-full mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCarousel;
