import { useState, useEffect } from 'react';
import { client } from '../utils/sanityClient';

const useSanityBooks = (queryType) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let query = '';

    // A dedicated query for summarized books
    if (queryType === 'summarized-books') {
      query = `
        *[_type == "bookReview" && defined(bookStructure) && count(bookStructure[_type == "part" && count(chapters) > 0 || _type == "chapter"]) > 0] {
          title,
          author,
          slug,
          "coverUrl": coverImage.asset->url
        } | order(_updatedAt desc)
      `;
    }

    if (!query) {
      setLoading(false);
      return;
    }

    client.fetch(query)
      .then((data) => {
        setBooks(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch from Sanity:', err);
        setError('Could not load data.');
        setLoading(false);
      });
  }, [queryType]);

  return { books, loading, error };
};

export default useSanityBooks;