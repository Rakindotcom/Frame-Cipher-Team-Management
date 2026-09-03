import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TaskAlerts from './TaskAlerts';

const getStoredSidebarState = () => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? true : JSON.parse(saved);
};

const getInitialLayoutState = () => {
    const isMobile = window.innerWidth < 1024;
    return {
        isMobile,
        sidebarOpen: isMobile ? false : getStoredSidebarState()
    };
};

export default function Layout({ children }) {
    const [{ sidebarOpen, isMobile }, setLayoutState] = useState(getInitialLayoutState);

    useEffect(() => {
        const handleResize = () => {
            const nextIsMobile = window.innerWidth < 1024;
            setLayoutState((current) => {
                if (current.isMobile === nextIsMobile) return current;
                return {
                    isMobile: nextIsMobile,
                    sidebarOpen: nextIsMobile ? false : getStoredSidebarState()
                };
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        const newState = !sidebarOpen;
        setLayoutState((current) => ({ ...current, sidebarOpen: newState }));
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
                        <TaskAlerts />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
