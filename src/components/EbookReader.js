import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../utils/sanityClient";
import { X, ChevronLeft, ChevronRight, List } from "lucide-react";

const EbookReader = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    const query =
      '*[_type == "bookReview" && slug.current == $slug][0]{ title, author, chapterSummaries }';
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
    return <div>Loading Reader...</div>;
  }

  if (!review || !review.chapterSummaries || review.chapterSummaries.length === 0) {
    return <div>No chapters available.</div>;
  }

  const { chapters } = { chapters: review.chapterSummaries };
  const currentChapter = chapters[currentChapterIndex];
  const progress = ((currentChapterIndex + 1) / chapters.length) * 100;

  const goToChapter = (index) => {
    setCurrentChapterIndex(index);
    setIsTocOpen(false);
  };

  const goToNextChapter = () =>
    currentChapterIndex < chapters.length - 1 &&
    setCurrentChapterIndex(currentChapterIndex + 1);

  const goToPreviousChapter = () =>
    currentChapterIndex > 0 &&
    setCurrentChapterIndex(currentChapterIndex - 1);

  const TableOfContents = () => (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isTocOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsTocOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform transform ${
          isTocOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Table of Contents</h2>
          <button onClick={() => setIsTocOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {chapters.map((chapter, index) => (
            <li key={index}>
              <button
                onClick={() => goToChapter(index)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  index === currentChapterIndex ? "font-bold" : ""
                }`}
              >
                Chapter {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link to={`/books/read/${slug}`} className="p-2">
          <X size={28} />
        </Link>
        <h1 className="text-lg font-semibold truncate">{review.title}</h1>
        <button onClick={() => setIsTocOpen(true)} className="p-2">
          <List size={28} />
        </button>
      </header>

      <TableOfContents />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line text-lg leading-relaxed">
            {currentChapter.summary}
          </p>
        </div>
      </main>

      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousChapter}
            disabled={currentChapterIndex === 0}
            className="p-2 disabled:opacity-50"
          >
            <ChevronLeft size={28} />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </span>
          <button
            onClick={goToNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            className="p-2 disabled:opacity-50"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EbookReader;
