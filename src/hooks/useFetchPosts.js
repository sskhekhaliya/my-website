import { useState, useEffect } from "react";
import slugify from "slugify";

const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const BLOGGER_ID = process.env.REACT_APP_BLOGGER_ID;
      const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

      if (!BLOGGER_ID || !API_KEY) {
        setError(
          "Blogger ID or API Key is missing. Please check your .env file.",
        );
        setLoading(false);
        return;
      }

      const API_URL = `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_ID}/posts?key=${API_KEY}&maxResults=100`;

      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Generate slug for each post
        const postsWithSlugs = (data.items || []).map((post) => ({
          ...post,
          slug: slugify(post.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
          }),
        }));

        setPosts(postsWithSlugs);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export default useFetchPosts;
