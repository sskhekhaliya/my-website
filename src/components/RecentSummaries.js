import React from 'react';
import { Link } from 'react-router-dom';
import useSanityBooks from '../hooks/useSanityBooks';
import Carousel from '../components/Carousel';
import { ArrowRight, BookOpen } from 'lucide-react';

const RecentSummaries = () => {
  const { books, loading, error } = useSanityBooks('summarized-books');

  if (loading) {
    return (
      <div className="flex space-x-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 flex-shrink-0 w-40">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const summarizedBooks = books.filter(
    (book) => book.slug && book.slug.current
  ).reverse(); // <-- This is the new line of code

  if (!Array.isArray(summarizedBooks) || summarizedBooks.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No recent summaries available.</p>;
  }

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
        <BookOpen className="mr-3 text-gray-400" /> Recent Summaries
      </h2>
      <p className="mb-6 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
        A collection of recently summarized books. Click to find chapter-wise detailed summaries and personal highlights.
      </p>
      <Carousel>
        {summarizedBooks.slice(0, 5).map((book, index) => {
          const imgSrc =
            book.coverUrl ||
            `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(
              book.title
            )}`;

          return (
            <Link
              key={index}
              to={`/books/read/${book.slug.current}`}
              className="snap-start flex-shrink-0 w-40 space-y-2 group"
            >
              <div className="overflow-hidden rounded-lg relative">
                <img
                  src={imgSrc}
                  alt={book.title}
                  onError={(e) =>
                    (e.target.src = `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(
                      book.title
                    )}`)
                  }
                  className="w-full aspect-[2/3] object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white font-semibold text-sm">Read More</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {book.author}
                </p>
              </div>
            </Link>
          );
        })}
      </Carousel>
      <div className="mt-4">
        <Link
          to="/books/read"
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          View all summaries <ArrowRight className="ml-1" size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RecentSummaries;