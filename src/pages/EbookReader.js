import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { client } from "../utils/sanityClient";
import { X, ChevronLeft, ChevronRight, List } from "lucide-react";
import classNames from "classnames";
import { PortableText } from "@portabletext/react";

const EbookReader = () => {
  const { slug, chapterIndex } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [chapterProgress, setChapterProgress] = useState(0);
  const mainContentRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);

  const storageKey = `ebook-${slug}`;

  // Fetch book review
  useEffect(() => {
    const query =
      '*[_type == "bookReview" && slug.current == $slug][0]{ title, author, bookStructure }';
    client.fetch(query, { slug }).then((data) => {
      setReview(data);
      setLoading(false);
    });
  }, [slug]);

  // Flatten all chapters
  const allChapters = useMemo(() => {
    if (!review || !review.bookStructure) return [];
    return review.bookStructure.flatMap((item) => {
      if (item._type === "part") {
        return item.chapters.map((chapter) => ({
          ...chapter,
          partTitle: item.partTitle || null,
        }));
      } else if (item._type === "chapter") {
        return [{ ...item }];
      }
      return [];
    });
  }, [review]);

  // Helper: safe parse
  const getSavedProgress = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  };

  // Load saved chapter + scroll
  useEffect(() => {
    if (!allChapters.length) return;

    let initialIndex = 0;
    if (chapterIndex && !isNaN(chapterIndex)) {
      // Subtract 1 because URL chapterIndex is 1-based
      const index = parseInt(chapterIndex, 10) - 1;
      if (index >= 0 && index < allChapters.length) {
        initialIndex = index;
      }
    } else {
      const saved = getSavedProgress();
      if (saved && saved.currentChapter < allChapters.length) {
        initialIndex = saved.currentChapter;
      }
    }

    setCurrentChapterIndex(initialIndex);

    // Set timeout to ensure DOM is rendered before scrolling
    setTimeout(() => {
      if (mainContentRef.current) {
        const saved = getSavedProgress();
        const scrollTop = saved?.scrollPositions?.[initialIndex] || 0;
        mainContentRef.current.scrollTo({ top: scrollTop });
      }
    }, 100);
  }, [allChapters, chapterIndex]);

  // Save progress (chapter + scroll per chapter)
  const saveProgress = (chapterIndex, scrollTop) => {
    const saved = getSavedProgress() || {
      currentChapter: 0,
      scrollPositions: {},
    };
    saved.currentChapter = chapterIndex;
    saved.scrollPositions = saved.scrollPositions || {};
    saved.scrollPositions[chapterIndex] = scrollTop;
    localStorage.setItem(storageKey, JSON.stringify(saved));
  };

  useEffect(() => {
    const node = mainContentRef.current;
    if (!node) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = node;
      const totalScrollableHeight = scrollHeight - clientHeight;
      const progress =
        totalScrollableHeight > 0
          ? (scrollTop / totalScrollableHeight) * 100
          : 100;
      setChapterProgress(progress);
      saveProgress(currentChapterIndex, scrollTop);
    };

    node.addEventListener("scroll", onScroll);

    return () => node.removeEventListener("scroll", onScroll);
  }, [currentChapterIndex]);

  // Save chapter index whenever it changes
  useEffect(() => {
    if (mainContentRef.current) {
      saveProgress(currentChapterIndex, mainContentRef.current.scrollTop);
      mainContentRef.current.scrollTo({ top: 0 });
      setChapterProgress(0);
    }
  }, [currentChapterIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") navigate(`/books/read/${slug}`);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slug, navigate]);

  // Navigate chapters
  const goToChapter = (index) => {
    setCurrentChapterIndex(index);
    // Use `replace` to prevent adding a new history entry for each chapter
    navigate(`/books/read/${slug}/p/${index + 1}`, { replace: true });
    setIsTocOpen(false);
  };
  const goToNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1)
      goToChapter(currentChapterIndex + 1);
  };
  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) goToChapter(currentChapterIndex - 1);
  };

  // Swipe handlers
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStart;
    if (deltaX < -50) goToNextChapter();
    else if (deltaX > 50) goToPreviousChapter();
    setTouchStart(null);
  };

  // Click screen for next/previous
  const handleClick = (e) => {
    const screenWidth = window.innerWidth;
    if (e.clientX < screenWidth / 2) goToPreviousChapter();
    else goToNextChapter();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
        Loading Reader...
      </div>
    );
  if (!review || !allChapters.length)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200">
        No chapters available.
      </div>
    );

  const currentChapter = allChapters[currentChapterIndex];
  const bookProgress = ((currentChapterIndex + 1) / allChapters.length) * 100;

  // Table of Contents
  const TableOfContents = () => (
    <>
      <div
        className={classNames(
          "fixed inset-0 bg-black transition-opacity z-40",
          isTocOpen
            ? "opacity-30 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsTocOpen(false)}
      />
      <div
        className={classNames(
          "fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-950 shadow-2xl z-50 transition-transform duration-300 ease-in-out",
          isTocOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Table of Contents
          </h2>
          <button
            onClick={() => setIsTocOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800 p-4 overflow-y-auto h-[calc(100%-140px)]">
          {review.bookStructure.map((item, partIndex) => {
            if (item._type === "part") {
              return (
                <li key={`part-${partIndex}`}>
                  {item.partTitle && (
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-3 py-2 mt-4">
                      {item.partTitle}
                    </h3>
                  )}
                  <ul className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    {item.chapters.map((chapter) => {
                      const globalIndex = allChapters.findIndex(
                        (c) => c._key === chapter._key,
                      );
                      return (
                        <li key={chapter._key}>
                          <button
                            onClick={() => goToChapter(globalIndex)}
                            className={classNames(
                              "w-full text-left px-3 py-4 rounded-lg transition-colors duration-200",
                              globalIndex === currentChapterIndex
                                ? "font-bold bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200",
                            )}
                          >
                            {chapter.chapterTitle}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            } else if (item._type === "chapter") {
              const globalIndex = allChapters.findIndex(
                (c) => c._key === item._key,
              );
              return (
                <li key={item._key}>
                  <button
                    onClick={() => goToChapter(globalIndex)}
                    className={classNames(
                      "w-full text-left px-3 py-4 rounded-lg transition-colors duration-200",
                      globalIndex === currentChapterIndex
                        ? "font-bold bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200",
                    )}
                  >
                    {item.chapterTitle}
                  </button>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </>
  );

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
          {review.title}
        </h1>
        <button
          onClick={() => setIsTocOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <List size={20} />
        </button>
      </header>

      <TableOfContents />

      <main
        ref={mainContentRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className="flex-1 p-3 md:p-12 lg:px-24 xl:px-48 overflow-y-auto pt-2 pb-[75px] pb-22 cursor-pointer"
      >
        <article className="prose dark:prose-invert max-w-3xl mx-auto w-full relative">
          <h5 className="text-center mt-4 mx-1 mx-5 font-bold mb-4">
            {currentChapter.chapterTitle}
          </h5>
          <div className="text-justify text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <PortableText value={currentChapter.chapterSummary} />
          </div>
        </article>
      </main>

      <footer className="fixed left-0 bottom-0 w-full z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${chapterProgress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between p-4 md:px-6 max-w-screen-xl mx-auto">
          <button
            onClick={goToPreviousChapter}
            disabled={currentChapterIndex === 0}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 px-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-0.5">
              <div
                className="bg-blue-600 h-0.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${bookProgress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              {currentChapterIndex + 1} of {allChapters.length}
            </div>
          </div>
          <button
            onClick={goToNextChapter}
            disabled={currentChapterIndex === allChapters.length - 1}
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
