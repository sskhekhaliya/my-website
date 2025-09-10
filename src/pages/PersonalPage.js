import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { AppContext } from '../layouts/SiteLayout';
import useFetchBooks from '../hooks/useFetchBooks';
import Carousel from '../components/Carousel';
import { ArrowRight, BookOpen, Lightbulb, PenSquare, Heart, Sparkles, Cpu } from 'lucide-react';
import RecentSummaries from '../components/RecentSummaries';

// Self-contained component for the "Currently Reading" carousel
const CurrentlyReadingCarousel = () => {
  // Use the hook to get books, loading, and error states.
  const { books, loading, error } = useFetchBooks('currently-reading');

  // Display a skeleton loader while the data is being fetched.
  if (loading) {
    return (
      <div className="flex space-x-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 flex-shrink-0 w-40">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Display an error message if the fetch fails.
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Display a message if there are no books on the shelf.
  if (!Array.isArray(books) || books.length === 0) {
    return <p>Not currently reading any books.</p>;
  }

  return (
    <Carousel>
      {/* Map over the first 5 books for the carousel display. */}
      {books.slice(0, 5).map((book, index) => {
        // Use a placeholder if the cover URL is missing.
        const imgSrc = book.coverUrl || `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(book.title)}`;
        
        return (
          <Link 
            key={index} 
            to="/books" // Link to a general books page or a specific reading page
            className="snap-start flex-shrink-0 w-40 space-y-2 group"
          >
            <div className="overflow-hidden rounded-lg">
              <img 
                src={imgSrc} 
                alt={book.title}
                // Fallback to placeholder if the image source fails to load.
                onError={(e) => (e.target.src = `https://placehold.co/400x600/1f2937/ffffff?text=${encodeURIComponent(book.title)}`)}
                // Apply consistent styling and hover effects from BookCard.
                className="w-full aspect-[2/3] object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{book.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
            </div>
          </Link>
        );
      })}
    </Carousel>
  );
};

// Main Homepage Component
const PersonalPage = () => {
    const { posts, loading: postsLoading } = useContext(AppContext);
    
    // Function to extract the first image URL from a blog post's HTML content
    const getPostThumbnail = (htmlContent) => {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        const img = div.querySelector('img');
        return img ? img.src : `https://placehold.co/600x400/232222/FFF?text=Blog+Post`;
    };

    const latestPosts = !postsLoading ? posts.slice(0, 3) : [];

    const skills = ['React', 'JavaScript (ES6+)', 'Node.js', 'Tailwind CSS', 'UI/UX Design', 'Firebase'];
    const hobbies = ['Reading Books', 'Playing Piano', 'Philosophy', 'Art & Expression', 'Spirituality', 'Continuous Learning'];

    return (
        <>
            <SEO
                title="Home - SSKhekhaliya"
                description="A Lifelong Learner. Explore my work in fitness, technology, and writing."
                name="Saurav Singh Khekhaliya"
                type="website"
            />
            <div className="space-y-16">
                {/* Intro Section */}
                <div className="animate-fade-in-up text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                        A Lifelong Learner
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        I'm Saurav Singh Khekhaliya — passionate about fitness, technology, and writing. This is a living showcase of my journey, thoughts, and creative projects.
                    </p>
                </div>

                {/* Latest Blog Posts Section */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
                        <Lightbulb className="mr-3 text-gray-400" /> Latest Thoughts
                    </h2>
                     <Carousel>
                        {postsLoading ? (
                             [...Array(3)].map(i => (
                                 <div key={i} className="snap-start flex-shrink-0 w-72 space-y-3 animate-pulse">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video"></div>
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            ))
                        ) : (
                            latestPosts.map((post, index) => (
                                <Link key={index} to={`/blog/${post.id}`} className="snap-start flex-shrink-0 w-72 space-y-2 group">
                                    <div className="overflow-hidden rounded-lg">
                                        <img src={getPostThumbnail(post.content)} alt={post.title} className="w-full h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 aspect-video" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 line-clamp-2">{post.title}</h4>
                                    </div>
                                </Link>
                            ))
                        )}
                     </Carousel>
                </div>
                        <RecentSummaries />
                {/* Currently Reading Section */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
                        <BookOpen className="mr-3 text-gray-400" /> Currently Reading
                    </h2>
                    <CurrentlyReadingCarousel />
                </div>
                
                {/* Writing & Brand Section */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
                            <PenSquare className="mr-3 text-gray-400" /> In The Works
                        </h2>
                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4">
                            <div>
                                <h3 className="font-bold text-lg">Eklavya – अधूरी प्रतिज्ञा</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">A mythological fiction novel that reinterprets ancient tales.</p>
                            </div>
                             <Link to="/books/writing" className="text-sm text-gray-600 dark:text-gray-400 hover:underline flex items-center">
                                Explore My Writing <ArrowRight className="ml-1" size={16} />
                            </Link>
                        </div>
                     </div>
                      <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
                            <Sparkles className="mr-3 text-gray-400" /> My Brand
                        </h2>
                         <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4">
                            <div>
                                <h3 className="font-bold text-lg">FIT CRAVE</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">A venture into the fitness food market with a focus on high-quality protein bars.</p>
                            </div>
                             <Link to="/fitness" className="text-sm text-gray-600 dark:text-gray-400 hover:underline flex items-center">
                                Learn More <ArrowRight className="ml-1" size={16} />
                            </Link>
                        </div>
                     </div>
                 </div>

                {/* Skills & Hobbies Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
                            <Cpu className="mr-3 text-gray-400" /> Technology & Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="bg-gray-100 dark:bg-gray-800 text-sm p-2 px-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 flex items-center">
                            <Heart className="mr-3 text-gray-400" /> Hobbies & Interests
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {hobbies.map(hobby => (
                                <span key={hobby} className="bg-gray-100 dark:bg-gray-800 text-sm p-2 px-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {hobby}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                 {/* End Note */}
                <div className="animate-fade-in-up text-center pt-8" style={{ animationDelay: '1s' }}>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Thank you for visiting. This space is constantly evolving, just like I am. Let's connect and share our journeys.
                    </p>
                </div>
            </div>
        </>
    );
};

export default PersonalPage;
