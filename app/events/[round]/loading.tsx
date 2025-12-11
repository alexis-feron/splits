export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button skeleton */}
      <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />

      {/* Hero section skeleton */}
      <div className="rounded-2xl shadow-lg p-6 md:p-8 mb-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex-grow space-y-4">
            <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-4 animate-pulse"
          >
            <div className="h-10 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Results table skeleton */}
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
