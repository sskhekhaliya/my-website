import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteLayout from './layout/SiteLayout';
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

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <SiteLayout>
                <Routes>
                    <Route path="/" element={<PersonalPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/fitness" element={<FitnessPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:postId" element={<SinglePostPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                </Routes>
            </SiteLayout>
        </BrowserRouter>
    );
};

export default AppRoutes;