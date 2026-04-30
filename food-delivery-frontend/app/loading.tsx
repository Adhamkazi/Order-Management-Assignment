export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <div className="h-12 bg-gray-200 rounded-xl w-80 mx-auto mb-3 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
      </div>
      <div className="flex gap-2 justify-center mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-9 w-20 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
