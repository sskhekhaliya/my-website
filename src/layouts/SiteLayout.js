import React, { useState, useRef, useEffect, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import TopHeader from '../components/TopHeader';
import PageSwitch from '../components/PageSwitch';
import MenuOverlay from '../components/MenuOverlay';
import useFetchPosts from '../hooks/useFetchPosts';

export const AppContext = createContext(null);

const SiteLayout = ({ children }) => {
    const [showScroll, setShowScroll] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mainContentRef = useRef(null);
    const location = useLocation();

    const { posts, loading, error } = useFetchPosts();
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        mainContentRef.current?.scrollTo({ top: 0 });
        setShowScroll(false);
        setScrollProgress(0);

        if (!location.pathname.startsWith('/blog')) {
            setSelectedTags([]); 
        }

        const mainEl = mainContentRef.current;
        if (!mainEl) return;

        const handleScroll = () => {
            setShowScroll(mainEl.scrollTop > 300);
            
            const totalScrollableHeight = mainEl.scrollHeight - mainEl.clientHeight;
            if (totalScrollableHeight > 0) {
                const currentProgress = (mainEl.scrollTop / totalScrollableHeight) * 100;
                setScrollProgress(currentProgress);
            } else {
                setScrollProgress(0);
            }
        };

        mainEl.addEventListener('scroll', handleScroll);
        return () => mainEl.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const scrollToTop = () => {
        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const circumference = 2 * Math.PI * 20; // 2 * pi * radius
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <AppContext.Provider value={{ posts, loading, error, selectedTags, setSelectedTags, mainContentRef, scrollProgress }}>
            <div className="bg-white dark:bg-[#232222] text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row h-screen">
                    <div className="flex flex-col flex-grow h-full overflow-hidden">
                        <TopHeader toggleMenu={toggleMenu} />
                        
                        <header className="hidden md:flex flex-shrink-0 items-center justify-center p-4 py-8">
                            <PageSwitch />
                        </header>

                        <main ref={mainContentRef} className="flex-grow p-6 md:p-10 overflow-y-auto hide-scrollbar pb-24 md:pb-10">
                            {children}
                        </main>
                    </div>

                    <Sidebar />
                </div>
                
                <BottomNav toggleMenu={toggleMenu}/>
                <MenuOverlay isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                
                {showScroll && (
                    <button 
                        onClick={scrollToTop} 
                        className="fixed bottom-20 right-8 z-50 w-12 h-12 rounded-full shadow-lg md:bottom-8 flex items-center justify-center"
                        aria-label="Back to top"
                    >
                        <svg className="w-full h-full" viewBox="0 0 44 44">
                            {/* Background Circle */}
                            <circle
                                cx="22"
                                cy="22"
                                r="20"
                                strokeWidth="3"
                                className="stroke-gray-200 dark:stroke-gray-700 fill-white dark:fill-gray-800"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="22"
                                cy="22"
                                r="20"
                                strokeWidth="3"
                                className="stroke-blue-500 fill-transparent"
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: strokeDashoffset,
                                    transform: 'rotate(-90deg)',
                                    transformOrigin: '50% 50%',
                                    transition: 'stroke-dashoffset 0.1s linear'
                                }}
                            />
                        </svg>
                        <ArrowUp size={20} className="absolute text-gray-800 dark:text-gray-200" />
                    </button>
                )}
            </div>
        </AppContext.Provider>
    );
};

export default SiteLayout;

