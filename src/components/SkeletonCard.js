import React from "react";

export const SkeletonCard = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-4"></div>
  </div>
);

export const SinglePostSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
    <div className="space-y-4">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
      </div>
      <div className="space-y-3 pt-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
