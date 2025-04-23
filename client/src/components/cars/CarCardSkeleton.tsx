

const CarCardSkeleton = () => {
  return (
    <div className="block group">
      <div className="overflow-hidden transition-all duration-300 rounded-lg bg-zinc-900 border border-zinc-800 h-80 w-full">
        {/* Fixed height for image container - matches the CarCard */}
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-zinc-800 animate-pulse">
          {/* Time Remaining Badge Skeleton */}
          <div className="absolute top-3 left-3 bg-zinc-700/80 text-transparent text-sm px-2 py-1 rounded-md flex items-center w-24 h-6">
          </div>
          
          {/* Current Bid Badge Skeleton */}
          <div className="absolute bottom-3 right-3 bg-zinc-700/80 text-transparent text-sm px-2 py-1 rounded-md w-20 h-6">
          </div>
          
          {/* No Reserve Badge Skeleton (randomly shown to match layout) */}
          <div className="absolute bottom-3 left-3 bg-zinc-700/80 text-transparent text-xs px-2 py-1 rounded-md w-16 h-5">
          </div>
        </div>
        
        {/* Fixed height for content container - matches the CarCard */}
        <div className="p-4 h-32 flex flex-col">
          {/* Title skeleton */}
          <div className="h-6 bg-zinc-800 rounded animate-pulse w-3/4"></div>
          
          {/* Specs skeleton with fixed height */}
          <div className="h-6 mt-1">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-full"></div>
          </div>
          
          {/* Location skeleton with fixed height */}
          <div className="h-5 mt-1">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardSkeleton;