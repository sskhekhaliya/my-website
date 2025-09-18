import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/SiteLayout";
import { ArrowLeft, Clock, Twitter, Linkedin, Facebook } from "lucide-react";
import SEO from "../components/SEO";
import { SinglePostSkeleton } from "../components/SkeletonCard";
import PostCarousel from "../components/PostCarousel";

// A new component for the share buttons
const ShareButtons = ({ url, title }) => {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  return (
    <div className="flex items-center space-x-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
      <span className="text-gray-600 dark:text-gray-400 font-semibold">Share this post:</span>
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 dark:text-gray-400 hover:text-blue-400 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={24} />
      </a>
      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={24} />
      </a>
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={24} />
      </a>
    </div>
  );
};

const SinglePostPage = () => {
  const { posts, loading, error, setSelectedTags } = useContext(AppContext);
  const { slug, postId } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === postId);

  const [currentUrl, setCurrentUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    if (post && post.slug && slug !== post.slug) {
      navigate(`/blog/${post.slug}/${post.id}`, { replace: true });
    }
  }, [post, slug, navigate]);

  useEffect(() => {
    if (post) {
      setCurrentUrl(window.location.href);
      setCurrentTitle(post.title);
    }
  }, [post]);

  useEffect(() => {
    const styleId = "scroll-progress-style";
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      .stroke-blue-500 {
        opacity: 1 !important;
      }
    `;

    return () => {
      if (styleTag) {
        styleTag.innerHTML = "";
      }
    };
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTags([tag]);
    navigate("/blog");
  };

  const calculateReadingTime = (htmlContent) => {
    if (!htmlContent) return "0 min read";
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || "";
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (loading || (!post && !error)) {
    return <SinglePostSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        Error fetching post: {error}
      </div>
    );
  }

  if (!post) {
    return <div className="text-center p-10">Post not found.</div>;
  }

  return (
    <>
      <SEO
        title={`${post.title} - SSKhekhaliya`}
        description={
          post.content
            ? post.content.substring(0, 160)
            : "An article by SSKhekhaliya."
        }
        name="Saurav Singh Khekhaliya"
        type="article"
      />
      <div className="animate-fade-in-up">
        <Link
          to="/blog"
          className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Blog</span>
        </Link>
        <article className="space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              Published on:{" "}
              {new Date(post.published).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{calculateReadingTime(post.content)}</span>
            </div>
          </div>
          {post.labels && post.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.labels.map((label) => (
                <button
                  key={label}
                  onClick={() => handleTagClick(label)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {currentUrl && currentTitle && <ShareButtons url={currentUrl} title={currentTitle} />}
        </article>
        <div className="mt-10 mb-5">
          <h4 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-50">
            More from the blog
          </h4>
          <hr className="mb-2"/>
          <PostCarousel excludeId={post.id} />
        </div>
      </div>
    </>
  );
};

export default SinglePostPage;