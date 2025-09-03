import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import useFetchBooks from '../hooks/useFetchBooks';
import writingBooks from '../content/writingBooks';

const GoodreadsSkeleton = () => (
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

export const GoodreadsWidget = ({ shelf }) => {
    const { books, loading, error } = useFetchBooks(shelf);

    if (loading) {
        return <GoodreadsSkeleton />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in-up">
            {books.map((book, index) => (
                <BookCard key={index} {...book} />
            ))}
        </div>
    );
};

const BookCard = ({ title, author, affiliateLink }) => {
    const [imgSrc, setImgSrc] = useState(`https://placehold.co/400x600/e2e8f0/e2e8f0?text=`);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target); // Stop observing once visible
                    const fetchImage = async () => {
                        const googleApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`;
                        try {
                            const googleRes = await fetch(googleApiUrl);
                            const googleData = await googleRes.json();
                            if (googleData.items && googleData.items[0].volumeInfo.imageLinks) {
                                setImgSrc(googleData.items[0].volumeInfo.imageLinks.thumbnail);
                            } else {
                                setImgSrc(`https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(title)}`);
                            }
                        } catch (e) {
                           setImgSrc(`https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(title)}`);
                        }
                    };
                    fetchImage();
                }
            },
            { rootMargin: "0px 0px 100px 0px" } // Load images 100px before they enter the viewport
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
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
            <div className="overflow-hidden rounded-lg">
                <img
                    src={imgSrc}
                    alt={title}
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 aspect-[2/3]"
                />
            </div>
            <div className="text-center">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{author}</p>
            </div>
        </a>
    );
};

export const BookList = ({ shelf }) => {
    const { books, loading, error } = useFetchBooks(shelf);

    if (loading) {
        return <GoodreadsSkeleton />;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in-up">
            {books.map((book, index) => (
                <BookCard key={index} {...book} />
            ))}
        </div>
    );
};

export const WritingSection = () => {
  const statusColors = {
    Concept: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Writing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Books I’m Writing</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Projects in progress — from early concepts to full drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {writingBooks.map((book, index) => (
          <div
            key={index}
            className="animate-fade-in-up p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              {book.title}
              <span
                className={`ml-3 text-xs px-2 py-1 rounded-full font-medium ${statusColors[book.progress] || ""}`}
              >
                {book.progress}
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {book.description}
            </p>

            {book.chaptersCompleted > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {book.chaptersCompleted} chapters completed
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">Not started yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const BookTabs = () => {
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(true);
    const navRef = useRef(null);

    const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setShowLeftFade(scrollLeft > 0);
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
    };

    useEffect(() => {
        const navEl = navRef.current;
        if (navEl) {
            handleScroll();
            navEl.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (navEl) {
                navEl.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleTabClick = (event) => {
        const nav = navRef.current;
        const button = event.currentTarget;
        if (nav && button) {
            const navCenter = nav.offsetWidth / 2;
            const buttonCenter = button.offsetLeft + button.offsetWidth / 2;
            nav.scrollTo({
                left: buttonCenter - navCenter,
                behavior: 'smooth'
            });
        }
    };

    const navLinkClasses = ({ isActive }) =>
        `flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
            isActive
                ? 'border-b-2 border-gray-800 dark:border-gray-200 text-gray-900 dark:text-gray-50'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        }`;

    return (
        <div className="relative border-b border-gray-200 dark:border-gray-700">
            <div 
                className={`absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-[#232222] pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
            ></div>
            <nav ref={navRef} className="-mb-px flex flex-nowrap space-x-6 overflow-x-auto hide-scrollbar" aria-label="Tabs">
                <NavLink to="/books/writing" className={navLinkClasses} onClick={handleTabClick}>Writing</NavLink>
                <NavLink to="/books/reading" className={navLinkClasses} onClick={handleTabClick}>Currently Reading</NavLink>
                <NavLink to="/books/read" className={navLinkClasses} onClick={handleTabClick}>Already Read</NavLink>
                <NavLink to="/books/to-read" className={navLinkClasses} onClick={handleTabClick}>Want to Read</NavLink>
            </nav>
            <div 
                className={`absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-[#232222] pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
            ></div>
        </div>
    );
};

export default BookTabs;
