import React, { useEffect, useRef, useState } from "react";
import useFetchBooks from "../hooks/useFetchBooks";

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

const BookCard = ({ title, author }) => {
  const [imgSrc, setImgSrc] = useState(
    `https://placehold.co/400x600/e2e8f0/e2e8f0?text=`
  );
  const affiliateLink = `https://www.amazon.in/s?k=${encodeURIComponent(
    `${title} ${author}`
  )}&tag=${process.env.REACT_APP_AMAZON_AFFILIATE_TAG}`;
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);

          const fetchImage = async () => {
            const googleApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
              title
            )}+inauthor:${encodeURIComponent(
              author
            )}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`;

            try {
              const googleRes = await fetch(googleApiUrl);
              const googleData = await googleRes.json();
              const imageUrl =
                googleData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
              if (imageUrl) {
                setImgSrc(imageUrl);
              } else {
                setImgSrc(
                  `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(
                    title
                  )}`
                );
              }
            } catch (e) {
              setImgSrc(
                `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(
                  title
                )}`
              );
            }
          };
          fetchImage();
        }
      },
      { rootMargin: "0px 0px 100px 0px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [title, author]);

  return (
    <a
      ref={cardRef}
      href={affiliateLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group space-y-2"
    >
      <img
        src={imgSrc}
        alt={title}
        onError={(e) =>
          (e.target.src = `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(
            title
          )}`)
        }
        className="rounded-lg"
      />
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
        <BookCard key={i} title={book.title} author={book.author} />
      ))}
    </div>
  );
};

export default GoodreadsBookList;
