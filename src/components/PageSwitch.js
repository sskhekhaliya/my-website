import React from "react";
import { NavLink } from "react-router-dom";
import { User, BookText, Briefcase, PenSquare, Dumbbell } from "lucide-react";

const PageSwitch = () => {
  const navLinkClasses = ({ isActive }) =>
    `py-2 transition-colors duration-300 ease-in-out flex items-center space-x-2 ${
      isActive
        ? "font-semibold text-gray-900 dark:text-gray-50"
        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
    }`;

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 md:space-x-8 md:gap-0">
      <NavLink to="/" className={navLinkClasses} end>
        <User size={18} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/blog" className={navLinkClasses}>
        <BookText size={18} />
        <span>Blog</span>
      </NavLink>
      <NavLink to="/projects" className={navLinkClasses}>
        <Briefcase size={18} />
        <span>Projects</span>
      </NavLink>
      <NavLink to="/books" className={navLinkClasses}>
        <PenSquare size={18} />
        <span>Books</span>
      </NavLink>
      <NavLink to="/fitness" className={navLinkClasses}>
        <Dumbbell size={18} />
        <span>Fitness</span>
      </NavLink>
    </div>
  );
};

export default PageSwitch;
