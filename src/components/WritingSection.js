import React from "react";
import writingBooks from "../content/writingBooks";

const WritingSection = () => {
  const statusColors = {
    Concept:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Writing:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {writingBooks.map((book, idx) => (
        <div
          key={idx}
          className="p-4 border rounded-lg shadow-sm dark:border-gray-700"
        >
          <h3 className="text-xl font-bold">{book.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {book.description}
          </p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs rounded ${statusColors[book.status]}`}
          >
            {book.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WritingSection;
