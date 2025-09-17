import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";

const BlogFilter = ({ posts, selectedTags, setSelectedTags }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const allTags = [...new Set(posts.flatMap((post) => post.labels || []))];

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="animate-fade-in-up space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="relative" ref={dropdownRef}>
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <span className="text-sm font-medium">
              {selectedTags.length === 0
                ? "Filter by Tags"
                : `${selectedTags.length} tag(s) selected`}
            </span>
            <ChevronDown
              className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              size={16}
            />
          </button>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <span>Clear filters</span>
              <X size={16} />
            </button>
          )}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isDropdownOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
        >
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`transition-colors text-xs font-medium px-2.5 py-1 rounded-full ${
                    selectedTags.includes(tag)
                      ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFilter;
