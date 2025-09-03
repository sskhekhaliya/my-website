import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import BookTabs, { WritingSection, BookList } from '../components/BookTabs';

const BooksPage = () => (
    <>
        <SEO
    title="Bookshelf - Saurav Singh Khekhaliya"
    description="A personal collection by Saurav Singh Khekhaliya featuring books I'm writing, currently reading, have finished, and plan to read."
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
                    <Route path="reading" element={<BookList shelf="currently-reading" />} />
                    <Route path="read" element={<BookList shelf="read" />} />
                    <Route path="to-read" element={<BookList shelf="to-read" />} />
                </Routes>
            </div>
        </div>
    </>
);

export default BooksPage;