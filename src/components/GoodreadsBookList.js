import React, { useState, useEffect } from "react";

// The missing useFetchBooks hook is now included in this file.
const useFetchBooks = (shelf) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shelf) {
      setLoading(false);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getGoodreadsShelf?shelf=${shelf}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch book list.");
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [shelf]);

  return { books, loading, error };
};

const GoodreadsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    ))}
  </div>
);

const BookCard = ({ title, author, coverUrl }) => {
  const affiliateLink = `https://www.amazon.in/s?k=${encodeURIComponent(
    `${title} ${author}`,
  )}&tag=${process.env.REACT_APP_AMAZON_AFFILIATE_TAG}`;

  const imgSrc =
    coverUrl ||
    `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(title)}`;

  return (
    <a
      href={affiliateLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group space-y-2"
    >
      <div className="overflow-hidden rounded-lg">
        <img
          src={imgSrc}
          alt={title}
          onError={(e) =>
            (e.target.src = `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(
              title,
            )}`)
          }
          // --- THIS IS THE FIX ---
          // Added transition classes and group-hover effect for a smooth zoom.
          className="w-full aspect-[2/3] object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-gray-500">{author}</p>
    </a>
  );
};

const GoodreadsBookList = ({ shelf }) => {
  const { books, loading, error } = useFetchBooks(shelf);

  if (loading) return <GoodreadsSkeleton />;
  if (error) return <p>{error}</p>;

  if (!Array.isArray(books) || books.length === 0) {
    return <p>There are no books on this shelf yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {books.map((book, i) => (
        <BookCard
          key={i}
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
        />
      ))}
    </div>
  );
};

export default GoodreadsBookList;
