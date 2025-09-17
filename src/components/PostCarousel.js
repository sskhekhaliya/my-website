import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../layouts/SiteLayout";
import Carousel from "./Carousel";

// Function to extract the first image URL from a blog post's HTML content
const getPostThumbnail = (htmlContent) => {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  const img = div.querySelector("img");
  return img
    ? img.src
    : `https://placehold.co/600x400/232222/FFF?text=Blog+Post`;
};

const PostCarousel = () => {
  const { posts, loading: postsLoading } = useContext(AppContext);

  // Get the latest 3 posts, or an empty array if loading or no posts exist
  const latestPosts = !postsLoading && posts ? posts.slice(0, 5) : [];

  return (
    <Carousel>
      {postsLoading
        ? [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 w-72 space-y-3 animate-pulse"
            >
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))
        : latestPosts.map((post, index) => (
            <Link
              key={index}
              to={`/blog/${post.slug}/${post.id}`}
              className="snap-start flex-shrink-0 w-72 space-y-2 group"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={getPostThumbnail(post.content)}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 aspect-video"
                />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 line-clamp-2">
                  {post.title}
                </h4>
              </div>
            </Link>
          ))}
    </Carousel>
  );
};

export default PostCarousel;
