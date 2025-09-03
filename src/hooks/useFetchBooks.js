import { useState, useEffect } from 'react';

const useFetchBooks = (shelf) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookList = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/getGoodreadsShelf?shelf=${shelf}`);
                if (!res.ok) {
                    throw new Error(`Serverless function error: ${res.statusText}`);
                }
                const bookList = await res.json();

                const booksWithAffiliateLinks = bookList.map(book => ({
                    ...book,
                    affiliateLink: `https://www.amazon.in/s?k=${encodeURIComponent(book.title + ' ' + book.author)}&tag=${process.env.REACT_APP_AMAZON_AFFILIATE_TAG}`
                }));

                setBooks(booksWithAffiliateLinks);
            } catch (e) {
                setError("Failed to fetch book list.");
            } finally {
                setLoading(false);
            }
        };

        if (shelf) {
            fetchBookList();
        }
    }, [shelf]);

    return { books, loading, error };
};

export default useFetchBooks;