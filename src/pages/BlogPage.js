import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../layouts/SiteLayout";
import BlogFilter from "../components/BlogFilter";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import SEO from "../components/SEO";

const SkeletonCard = () => (
  <div className="flex flex-col md:flex-row md:space-x-8 animate-pulse">
    <div className="md:w-1/3 mb-4 md:mb-0">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
    <div className="md:w-2/3 space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

const LoadingIndicator = () => (
  <>
    <style>
      {`
                @keyframes loading-progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-loading-progress {
                    animation: loading-progress 1.5s ease-in-out infinite;
                }
            `}
    </style>
    <div className="md:hidden fixed bottom-[50px] left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 overflow-hidden z-50">
      <div className="w-full h-full bg-blue-500 animate-loading-progress"></div>
    </div>
    <div className="hidden md:flex justify-center py-6">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  </>
);

const BlogPage = () => {
  const {
    posts,
    loading,
    error,
    selectedTags,
    setSelectedTags,
    mainContentRef,
  } = useContext(AppContext);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredPosts = posts.filter((post) => {
    const tagsMatch =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => post.labels && post.labels.includes(tag));
    return tagsMatch;
  });

  const postsToShow = filteredPosts.slice(0, visibleCount);

  useEffect(() => {
    const handleScroll = () => {
      const mainEl = mainContentRef.current;
      if (!mainEl || loadingMore || visibleCount >= filteredPosts.length)
        return;
      if (mainEl.scrollHeight - mainEl.scrollTop <= mainEl.clientHeight + 200) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prevCount) => prevCount + 5);
          setLoadingMore(false);
        }, 1000);
      }
    };
    const mainEl = mainContentRef.current;
    if (mainEl) mainEl.addEventListener("scroll", handleScroll);
    return () => {
      if (mainEl) mainEl.removeEventListener("scroll", handleScroll);
    };
  }, [mainContentRef, visibleCount, filteredPosts.length, loadingMore]);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [tag],
    );
    mainContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPostThumbnail = (htmlContent) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const img = div.querySelector("img");
    return img
      ? img.src
      : `https://placehold.co/600x400/e2e8f0/334155?text=Article`;
  };

  const createSnippet = (htmlContent) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || "";
    return text.substring(0, 150) + "...";
  };

  const calculateReadingTime = (htmlContent) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || "";
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        Error fetching posts: {error}
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Blog - SSKhekhaliya"
        description="Read articles on social issues, science, health, and personal reflections."
        name="Saurav Singh Khekhaliya"
        type="website"
      />
      <div className="space-y-12">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 animate-fade-in-up">
            The Blog
          </h1>
          <BlogFilter
            posts={posts}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>

        {loading ? (
          <div className="space-y-12">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : postsToShow.length > 0 ? (
          postsToShow.map((post, index) => (
            <article
              key={post.id}
              className="animate-fade-in-up flex flex-col md:flex-row md:space-x-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="md:w-1/3 mb-4 md:mb-0">
                <Link to={`/blog/${post.slug}/${post.id}`}>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={getPostThumbnail(post.content)}
                      alt={post.title}
                      className="w-full h-full object-cover aspect-video transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              </div>
              <div className="md:w-2/3">
                <Link
                  to={`/blog/${post.slug}/${post.id}`}
                  className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {post.title}
                  </h2>
                </Link>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{new Date(post.published).toLocaleDateString()}</span>
                  <span>·</span>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{calculateReadingTime(post.content)}</span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {createSnippet(post.content)}
                </p>

                {post.labels && post.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.labels.map((label) => (
                      <button
                        key={label}
                        onClick={() => handleTagClick(label)}
                        className={`transition-colors text-xs font-medium px-2.5 py-1 rounded-full ${
                          selectedTags.includes(label)
                            ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                <Link
                  to={`/blog/${post.slug}/${post.id}`}
                  className="text-gray-600 dark:text-gray-400 hover:underline inline-block font-semibold"
                >
                  Read more...
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p>No posts found matching your criteria.</p>
        )}

        {loadingMore && <LoadingIndicator />}
      </div>
    </>
  );
};

export default BlogPage;
