import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import SocialMedia from './SocialMedia';

const Sidebar = () => {
    const sidebarNavLinkClasses = ({ isActive }) =>
    `transition-colors duration-200 ${
        isActive 
        ? 'font-semibold text-gray-900 dark:text-gray-100 underline' 
        : 'text-gray-600 dark:text-gray-400 hover:underline'
    }`;

    return (
        <aside className="hidden md:flex flex-col items-start justify-between w-64 lg:w-80 p-8 flex-shrink-0">
            <Link to="/" className="[writing-mode:vertical-rl]">
                <h2 className="text-2xl font-bold">SSKhekhaliya</h2>
                <p className="text-sm text-gray-500">A Lifelong Learner</p>
            </Link>
            <div className="flex flex-col items-start space-y-6 text-left w-full">
                <nav className="flex flex-col space-y-4">
                    <NavLink to="/" className={sidebarNavLinkClasses} end>Home</NavLink>
                    <NavLink to="/blog" className={sidebarNavLinkClasses}>Blog</NavLink>
                    <NavLink to="/about" className={sidebarNavLinkClasses}>About</NavLink>
                    <NavLink to="/contact" className={sidebarNavLinkClasses}>Contact</NavLink>
                </nav>
                <div className="flex space-x-4">
                    <SocialMedia />
                </div>
               <ThemeToggle />
               <div className='text-xs text-gray-500 !mt-8'>
               <Footer />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

