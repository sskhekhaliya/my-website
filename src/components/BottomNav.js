import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, BookText, Briefcase, PenSquare, Dumbbell, Menu } from 'lucide-react';

const BottomNav = ({toggleMenu}) => {
    const navLinkClasses = ({ isActive }) =>
        `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
            isActive
                ? "text-gray-900 dark:text-gray-50"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#232222] border-t border-gray-200 dark:border-gray-700 flex justify-around">
            <NavLink to="/" className={navLinkClasses} end>
                <User size={24} />
                <span>Personal</span>
            </NavLink>
            <NavLink to="/blog" className={navLinkClasses}>
                <BookText size={24} />
                <span>Blog</span>
            </NavLink>
            <NavLink to="/projects" className={navLinkClasses}>
                <Briefcase size={24} />
                <span>Projects</span>
            </NavLink>
            <NavLink to="/books" className={navLinkClasses}>
                <PenSquare size={24} />
                <span>Books</span>
            </NavLink>
            <NavLink to="/fitness" className={navLinkClasses}>
                <Dumbbell size={24} />
                <span>Fitness</span>
            </NavLink>
            <NavLink onClick={toggleMenu} className={navLinkClasses}>
                <Menu size={28} />
                <span>Menu</span>
            </NavLink>                
            
        </nav>
    );
};

export default BottomNav;