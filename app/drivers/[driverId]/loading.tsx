export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Bouton retour skeleton */}
      <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />

      {/* Section Hero skeleton */}
      <div className="rounded-2xl shadow-lg p-6 md:p-8 mb-8 bg-gray-50">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-200 animate-pulse" />
          <div className="flex-grow space-y-4 w-full">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto md:mx-0 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto md:mx-0 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats rapides skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-4 animate-pulse"
          >
            <div className="h-10 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>

      {/* Informations personnelles skeleton */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-full" />
          <div className="h-6 bg-gray-200 rounded w-full" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
        </div>
      </div>

      {/* Résultats de la saison skeleton */}
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
