import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../utils/sanityClient";
import { X, ChevronLeft, ChevronRight, List } from "lucide-react";
import classNames from "classnames";

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
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
        Loading Reader...
      </div>
    );
  }

  if (!review || !review.chapterSummaries || review.chapterSummaries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
        No chapters available.
      </div>
    );
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
        className={classNames(
          "fixed inset-0 bg-black transition-opacity z-40",
          isTocOpen ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsTocOpen(false)}
      />
      <div
        className={classNames(
          "fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-950 shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          isTocOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Table of Contents</h2>
          <button
            onClick={() => setIsTocOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800 p-4 overflow-y-auto h-[calc(100%-80px)]">
          {chapters.map((chapter, index) => (
            <li key={index}>
              <button
                onClick={() => goToChapter(index)}
                className={classNames(
                  "w-full text-left px-3 py-4 rounded-lg transition-colors duration-200",
                  index === currentChapterIndex
                    ? "font-bold bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                )}
              >
                Chapter {index + 1}: <span className="text-sm font-normal break-normal">{chapter.chapterTitle}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen text-gray-800 dark:text-gray-200 overflow-hidden">
      <header className="flex items-center justify-between flex-shrink-0 border-b border-gray-200 dark:border-gray-800">
        <Link to={`/books/read/${slug}`} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
          <X size={28} />
        </Link>
        <h1 className="text-xl font-bold text-center truncate">{review.title}</h1>
        <button
          onClick={() => setIsTocOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <List size={28} />
        </button>
      </header>

      <TableOfContents />

      <main className="flex-1 p-3 md:p-12 lg:px-24 xl:px-48 overflow-y-auto pt-2 pb-22">
        <article className="prose dark:prose-invert max-w-3xl mx-auto w-full relative">
          <h5 className="text-center mt-4 mx-1 mx-5 font-bold mb-4">{currentChapter.chapterTitle}</h5>
          <p className="whitespace-pre-line text-justify text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {currentChapter.summary}
          </p>
        </article>
      </main>

      <footer className="fixed left-0 bottom-0 w-full p-4 md:px-6 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <button
            onClick={goToPreviousChapter}
            disabled={currentChapterIndex === 0}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex-1 px-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Chapter {currentChapterIndex + 1} of {chapters.length}
            </div>
          </div>
          
          <button
            onClick={goToNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EbookReader;