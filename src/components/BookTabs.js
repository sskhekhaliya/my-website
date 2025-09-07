import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const BookTabs = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const handleScroll = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setShowLeftFade(scrollLeft > 5);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const navEl = navRef.current;
    if (navEl) {
      handleScroll();
      navEl.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (navEl) {
        navEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollTabToCenter = (tab) => {
    if (tab && navRef.current) {
      const nav = navRef.current;
      const tabRect = tab.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const scrollOffset =
        tabRect.left -
        navRect.left +
        tab.offsetWidth / 2 -
        nav.offsetWidth / 2;
      nav.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  const TabButton = ({ to, children }) => {
    const navLinkRef = useRef(null);
    const isActive = location.pathname === to;

    useEffect(() => {
      if (isActive && navLinkRef.current) {
        setTimeout(() => scrollTabToCenter(navLinkRef.current), 100);
      }
    }, [isActive]);

    const handleClick = (e) => {
      scrollTabToCenter(e.currentTarget);
    };

    return (
      <NavLink
        ref={navLinkRef}
        to={to}
        onClick={handleClick}
        className={({ isActive }) =>
          `flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
            isActive
              ? "border-b-2 border-gray-800 dark:border-gray-200 text-gray-900 dark:text-gray-50"
              : "border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`
        }
      >
        {children}
      </NavLink>
    );
  };

  return (
    <div className="relative">
      <div
        ref={navRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide"
      >
        <TabButton to="/books/writing">Writing</TabButton>
        <TabButton to="/books/reading">Currently Reading</TabButton>
        <TabButton to="/books/read">Read</TabButton>
        <TabButton to="/books/to-read">To Read</TabButton>
      </div>
      {showLeftFade && (
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      )}
      {showRightFade && (
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default BookTabs;
