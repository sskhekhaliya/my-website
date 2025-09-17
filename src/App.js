import React, { useState, createContext, useEffect, useContext } from "react";
import AppRoutes from "./AppRoutes";

export const ThemeContext = createContext(null);

const ThemedApp = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#232222] transition-colors duration-300">
      <AppRoutes />
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemedApp />
    </ThemeContext.Provider>
  );
}
