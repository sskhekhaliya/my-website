import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import BookTabs from '../components/BookTabs';
import BookListPage from './BookListPage';
import WritingSection from '../components/WritingSection';
import GoodreadsBookList from '../components/GoodreadsBookList';

const BooksPage = () => (
    <>
        <SEO
            title="Books & Writing - SSKhekhaliya"
            description="Explore my writing projects and detailed book reviews."
            name="Saurav Singh Khekhaliya"
            type="website"
        />
        <div className="space-y-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-8 animate-fade-in-up">Bookshelf</h1>
            <BookTabs />
            <div className="mt-8">
                <Routes>
                    <Route path="/" element={<Navigate to="writing" replace />} />
                    <Route path="writing" element={<WritingSection />} />
                    <Route path="read" element={<BookListPage />} />
                    <Route path="reading" element={<GoodreadsBookList shelf="currently-reading" />} />
                    <Route path="to-read" element={<GoodreadsBookList shelf="to-read" />} />
                </Routes>
            </div>
        </div>
    </>
);

export default BooksPage;