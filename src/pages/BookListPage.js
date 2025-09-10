import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../utils/sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  if (!source) return '';
  return builder.image(source);
}

const BookListSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const BookListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We now request the 'hasChapters' field in the query
    const query = `
  *[_type == "bookReview"] {
  ...,
  "hasChapters": count(bookStructure) > 0 && count(bookStructure[_type == "part" && count(chapters) > 0 || _type == "chapter"]) > 0,
  "hasReview": defined(yourReview) && count(yourReview) > 0 && yourReview[0].children[0].text != "",
  "isTagged": (count(bookStructure) > 0 && count(bookStructure[_type == "part" && count(chapters) > 0 || _type == "chapter"]) > 0) || (defined(yourReview) && count(yourReview) > 0 && yourReview[0].children[0].text != "")
} | order(isTagged asc, _updatedAt desc)
`;
    
    client
      .fetch(query)
      .then((data) => {
        setReviews(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch reviews from Sanity:', err);
        setError('Could not load book reviews. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) return <BookListSkeleton />;

  if (error)
    return (
      <div className="text-red-500 text-center mt-8">
        {error}
      </div>
    );

  const validReviews = reviews.filter((book) => book.slug && book.slug.current);

  if (validReviews.length === 0)
    return (
      <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
        No book reviews available.
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {validReviews.map((book) => (
        <Link
          key={book._id}
          to={`/books/read/${book.slug.current}`}
          className="group space-y-2 relative"
        >
          <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src={
                book.coverImage
                  ? urlFor(book.coverImage).width(400).url()
                  : 'https://placehold.co/400x600/e2e8f0/334155?text=No+Cover'
              }
              alt={book.title}
              loading="lazy"
              className="w-full h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 aspect-[2/3]"
            />
            
            {/* Conditional rendering for the two tags */}
    {book.hasChapters && (
      <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-md opacity-90">
        Summarized
      </div>
    )}
    
    {!book.hasChapters && book.hasReview && (
      <div className="absolute top-2 right-2 px-2 py-1 bg-gray-500 text-white rounded-full text-xs font-bold shadow-md opacity-90">
        Reviewed
      </div>
    )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white font-semibold text-sm">Read Review</span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BookListPage;