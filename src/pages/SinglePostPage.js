import React, { useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../layouts/SiteLayout';
import { ArrowLeft, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { SinglePostSkeleton } from '../components/SkeletonCard';

const SinglePostPage = () => {
    const { posts, loading, error, setSelectedTags } = useContext(AppContext);
    const { postId } = useParams();
    const navigate = useNavigate();
    const post = posts.find(p => p.id === postId);

    // This effect controls the visibility of the progress bar
    useEffect(() => {
        const styleId = 'scroll-progress-style';
        let styleTag = document.getElementById(styleId);

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        // When on this page, make the progress circle visible
        styleTag.innerHTML = `
            .stroke-blue-500 {
                opacity: 1 !important;
                transition: opacity 0.3s ease-in-out;
            }
        `;

        // When we leave this page, hide it again
        return () => {
            styleTag.innerHTML = `
                .stroke-blue-500 {
                    opacity: 0 !important;
                    transition: opacity 0.3s ease-in-out;
                }
            `;
        };
    }, []);

    const handleTagClick = (tag) => {
        setSelectedTags([tag]);
        navigate('/blog');
    };
    
    const calculateReadingTime = (htmlContent) => {
        if (!htmlContent) return '0 min read';
        const div = document.createElement('div');
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
        return <div className="text-center p-10 text-red-500">Error fetching post: {error}</div>;
    }
    
    if (!post) {
        return <div className="text-center p-10">Post not found.</div>;
    }

    return (
        <>
            <SEO
                title={`${post.title} - SSKhekhaliya`}
                description={post.content ? post.content.substring(0, 160) : 'An article by SSKhekhaliya.'}
                name="Saurav SIngh Khekhaliya"
                type="article"
            />
            <div className="animate-fade-in-up">
                <Link to="/blog" className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-8">
                    <ArrowLeft size={18} />
                    <span>Back to Blog</span>
                </Link>
                <article className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">{post.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(post.published).toLocaleDateString()}</span>
                        <span>·</span>
                        <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{calculateReadingTime(post.content)}</span>
                        </div>
                    </div>
                    {post.labels && post.labels.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.labels.map(label => (
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
                </article>
            </div>
        </>
    );
};

export default SinglePostPage;
