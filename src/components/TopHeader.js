import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const TopHeader = ({ toggleMenu }) => {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-[#232222] p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <Link to="/">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              SSKhekhaliya
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A Lifelong Learner
            </p>
          </Link>
        </div>
        <div className="w-1/2 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
