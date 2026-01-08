import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load sidebar state from localStorage on desktop
    useEffect(() => {
        if (!isMobile) {
            const saved = localStorage.getItem('sidebarOpen');
            if (saved !== null) {
                setSidebarOpen(JSON.parse(saved));
            }
        }
    }, [isMobile]);

    const toggleSidebar = () => {
        const newState = !sidebarOpen;
        setSidebarOpen(newState);
        if (!isMobile) {
            localStorage.setItem('sidebarOpen', JSON.stringify(newState));
        }
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            <div className={`main-content ${sidebarOpen && !isMobile ? 'main-content-with-sidebar' : 'main-content-full'}`}>
                {/* Top Bar */}
                <header className="topbar">
                    <button
                        onClick={toggleSidebar}
                        className="topbar-toggle"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* Main Content */}
                <main className="main-container">
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
