import React, { useContext } from "react";
import { ThemeContext } from "../App";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1"
    >
      <div
        className="absolute bg-white dark:bg-gray-900 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${theme === "light" ? "0" : "2rem"})` }}
      ></div>
      <div className="w-full flex justify-between">
        <Moon size={16} className="text-gray-500 ml-1" />
        <Sun size={16} className="text-gray-500 mr-1" />
      </div>
    </button>
  );
};

export default ThemeToggle;
