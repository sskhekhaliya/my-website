import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../utils/sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { Star, BookOpen, Bookmark } from "lucide-react";
import SEO from "../components/SEO";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  if (!source) return "";
  return builder.image(source);
}

const BookReviewSkeleton = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
    <div className="flex flex-col md:flex-row md:space-x-8 items-start">
      <div className="w-48 md:w-64 h-72 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg mb-6 md:mb-0"></div>
      <div className="flex-1 space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="space-y-2 pt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 pt-2"></div>
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

const StarRating = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
      />
    ))}
  </div>
);

const ExpandableDescription = ({ text, maxLength = 200 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text || text.length <= maxLength) {
        return <p className="text-gray-700 dark:text-gray-300 my-4">{text}</p>;
    }

    return (
        <div className="my-4">
            <p className="text-gray-700 dark:text-gray-300">
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            </p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-yellow-600 dark:text-yellow-400 hover:underline font-semibold mt-2 text-sm"
            >
                {isExpanded ? 'Read less' : 'Read more'}
            </button>
        </div>
    );
};

const BookReviewPage = () => {
  const { slug } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChapterIndex, setLastChapterIndex] = useState(1); // Default to page 1

  useEffect(() => {
    // Check local storage for the last saved chapter index
    try {
      const savedProgress = localStorage.getItem(`ebook-${slug}`);
      if (savedProgress) {
        const data = JSON.parse(savedProgress);
        // Add 1 to the saved 0-based index to get the 1-based URL
        const lastVisitedChapter = data.currentChapter + 1;
        setLastChapterIndex(lastVisitedChapter);
      }
    } catch (e) {
      console.error("Failed to parse saved progress from localStorage", e);
    }

    // Fetch the book review data
    const query = `*[_type == "bookReview" && slug.current == $slug][0]{
        ...,
        "bookDescription": bookDescription
    }`;
    const params = { slug };

    client.fetch(query, params).then((data) => {
      setReview(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <BookReviewSkeleton />;
  if (!review) return <p>Review not found.</p>;

  return (
    <>
      <SEO
        title={`${review.title} - Book Review`}
        description={review.bookDescription || `A detailed review and chapter summary of ${review.title} by ${review.author}.`}
        name="Saurav Singh Khekhaliya"
        type="article"
      />

      <div className="flex flex-col md:flex-row md:space-x-8 items-start mb-12">
        <img
          src={
            review.coverImage
              ? urlFor(review.coverImage).width(400).url()
              : "https://placehold.co/400x600/e2e8f0/334155?text=No+Cover"
          }
          alt={review.title}
          className="w-48 md:w-64 rounded-lg shadow-lg mb-6 md:mb-0"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{review.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            by {review.author}
          </p>
          
          <ExpandableDescription text={review.bookDescription} />
          
          <StarRating rating={review.yourRating} />
          {review.affiliateLink && (
            <a
              href={review.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
            >
              Buy on Amazon
            </a>
          )}
        </div>
      </div>

      {review.yourReview && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">My Review</h2>
          <div className="prose dark:prose-invert max-w-none">
            <PortableText value={review.yourReview} />
          </div>
        </div>
      )}

      {/* Button section */}
      <div className="mt-8 flex flex-wrap gap-4">
        {review.bookStructure && review.bookStructure.length > 0 && (
          <Link
            to={`/books/read/${slug}/p/${lastChapterIndex}`}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          >
            <BookOpen size={20} />
            <span>Read Chapter Summaries</span>
          </Link>
        )}
        {review.highlightsAndNotes && review.highlightsAndNotes.length > 0 && (
          <Link
            to={`/books/read/${slug}/highlights`}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          >
            <Bookmark size={20} />
            <span>Read Highlights</span>
          </Link>
        )}
      </div>

    </>
  );
};

export default BookReviewPage;