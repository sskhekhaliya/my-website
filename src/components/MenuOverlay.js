import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Footer from "./Footer";
import SocialMedia from "./SocialMedia";

const MenuOverlay = ({ isOpen, toggleMenu }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleMenu}
      ></div>

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 max-w-xs bg-white dark:bg-[#232222] text-gray-900 dark:text-gray-100 shadow-2xl z-50 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu}>
            <X size={32} />
          </button>
        </div>
        <div className="flex flex-col justify-between h-full p-8 pb-24">
          <nav className="flex flex-col space-y-6 text-xl font-light">
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/blog" onClick={toggleMenu}>
              Blog
            </Link>
            <Link to="/about" onClick={toggleMenu}>
              About
            </Link>
            <Link to="/contact" onClick={toggleMenu}>
              Contact
            </Link>
          </nav>
          <div>
            <div className="flex justify-center space-x-6 mb-8">
              <SocialMedia />
            </div>
            <div className="flex justify-center mb-8">
              <ThemeToggle />
            </div>
            <div className="text-center text-xs text-gray-500">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuOverlay;
