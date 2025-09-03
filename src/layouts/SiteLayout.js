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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mainContentRef = useRef(null);
    const location = useLocation();

    const { posts, loading, error } = useFetchPosts();
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        mainContentRef.current?.scrollTo({ top: 0 });
        setShowScroll(false);
        if (!location.pathname.startsWith('/blog')) {
            setSelectedTags([]); 
        }

        const mainEl = mainContentRef.current;
        if (!mainEl) return;

        const checkScrollTop = () => {
            setShowScroll(mainEl.scrollTop > 300);
        };

        mainEl.addEventListener('scroll', checkScrollTop);
        return () => mainEl.removeEventListener('scroll', checkScrollTop);
    }, [location.pathname]);

    const scrollToTop = () => {
        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <AppContext.Provider value={{ posts, loading, error, selectedTags, setSelectedTags, mainContentRef }}>
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
                    <button onClick={scrollToTop} className="fixed bottom-20 right-8 z-50 p-3 bg-gray-800 text-white rounded-full shadow-lg md:bottom-8">
                        <ArrowUp size={24} />
                    </button>
                )}
            </div>
        </AppContext.Provider>
    );
};

export default SiteLayout;