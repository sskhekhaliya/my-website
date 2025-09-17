import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../utils/sanityClient";
import { X, Bookmark } from "lucide-react";

const BookHighlightsReader = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the highlights and notes for the specific book slug
    const query =
      '*[_type == "bookReview" && slug.current == $slug][0]{ title, author, highlightsAndNotes }';
    const params = { slug };

    client.fetch(query, params).then((data) => {
      setReview(data);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") navigate(`/books/read/${slug}`);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
        Loading Highlights...
      </div>
    );
  }

  if (
    !review ||
    !review.highlightsAndNotes ||
    review.highlightsAndNotes.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
        No highlights or notes available.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen text-gray-800 dark:text-gray-200 overflow-hidden">
      <header className="flex items-center justify-between flex-shrink-0 border-b pb-3 border-gray-200 dark:border-gray-800">
        <Link
          to={`/books/read/${slug}`}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <X size={20} />
        </Link>
        <h1 className="text-l font-bold text-center truncate">
          {review.title} Highlights
        </h1>
        <div className="w-8 h-8"></div> {/* Placeholder to center the title */}
      </header>

      <main className="flex-1 p-3 md:p-12 lg:px-24 xl:px-48 overflow-y-auto pt-2 pb-22">
        <article className="prose dark:prose-invert max-w-3xl mx-auto w-full relative">
          <h2 className="text-2xl font-bold mb-4">Highlights and Notes</h2>
          <ul className="list-disc list-inside space-y-4 text-lg">
            {review.highlightsAndNotes.map((highlight, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                <Bookmark
                  className="inline-block mr-2 text-blue-500"
                  size={16}
                />
                {highlight}
              </li>
            ))}
          </ul>
        </article>
      </main>
    </div>
  );
};

export default BookHighlightsReader;
