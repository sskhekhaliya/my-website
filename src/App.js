import React, { useState, createContext, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import PersonalPage from './pages/PersonalPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import BooksPage from './pages/BooksPage';
import FitnessPage from './pages/FitnessPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import SinglePostPage from './pages/SinglePostPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import BookReviewPage from './pages/BookReviewPage';
import EbookReader from './pages/EbookReader';
import BookHighlightsReader from './pages/BookHighlightsReader';

export const ThemeContext = createContext(null);

const ThemedApp = () => {
    const { theme } = useContext(ThemeContext);
    
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#232222] transition-colors duration-300">
            <SiteLayout>
                <Routes>
                    <Route path="/" element={<PersonalPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/books/*" element={<BooksPage />} />
                    <Route path="/fitness" element={<FitnessPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:postId" element={<SinglePostPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                    <Route path="/books/*" element={<BooksPage />} />
                     <Route path="/books/read/:slug" element={<BookReviewPage />} />
                     <Route path="/books/read/:slug" element={<BookReviewPage />} />
        <Route path="/books/read/:slug/reader" element={<EbookReader />} /> 
        <Route path="/books/read/:slug/highlights" element={<BookHighlightsReader />} /> 
                </Routes>
            </SiteLayout>
        </div>
    );
};

export default function App() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <BrowserRouter>
                <ThemedApp />
            </BrowserRouter>
        </ThemeContext.Provider>
    );
}