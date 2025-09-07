const BookReviewSkeleton = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
    <div className="flex flex-col md:flex-row md:space-x-8 items-start">
      <div className="w-48 md:w-64 h-72 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg mb-6 md:mb-0"></div>
      <div className="flex-1 space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-4"></div>
      </div>
    </div>
    <div className="mt-12 space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);
export default BookReviewSkeleton;