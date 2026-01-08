import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import { signOut } from '../firebase/auth';
import { getInitials, getAvatarColor } from '../utils/helpers';

export default function Sidebar({ isOpen, onToggle }) {
    const { userProfile, isAdmin } = useAuth();
    const { projects } = useProjects();
    const location = useLocation();
    const navigate = useNavigate();
    const [projectsExpanded, setProjectsExpanded] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path) => location.pathname === path;
    const isProjectActive = (projectId) => location.pathname === `/projects/${projectId}`;

    const mainNavItems = [
        {
            to: '/dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            to: '/projects',
            label: 'All Projects',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            )
        },
        {
            to: '/notices',
            label: 'Notices',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            )
        }
    ];

    if (isAdmin) {
        mainNavItems.push({
            to: '/users',
            label: 'Team',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        });
    }

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {/* Logo */}
                <div className="sidebar-header">
                    <Link to="/dashboard" className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="CKH Network"
                            className="w-28"
                        />
                    </Link>
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-[--bg-tertiary] text-[--text-muted]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`sidebar-item ${isActive(item.to) ? 'sidebar-item-active' : ''}`}
                            >
                                {item.icon}
                                <span className="sidebar-label">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Projects Section */}
                    <div className="sidebar-section">
                        <button
                            onClick={() => setProjectsExpanded(!projectsExpanded)}
                            className="sidebar-section-header"
                        >
                            <span className="sidebar-label text-xs font-semibold text-[--text-muted] uppercase tracking-wider">
                                Projects
                            </span>
                            <svg
                                className={`w-4 h-4 text-[--text-muted] transition-transform sidebar-label ${projectsExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {projectsExpanded && (
                            <div className="space-y-0.5 mt-1">
                                {projects.length === 0 ? (
                                    <p className="px-3 py-2 text-xs text-[--text-muted] sidebar-label">No projects yet</p>
                                ) : (
                                    projects.map((project) => (
                                        <Link
                                            key={project.id}
                                            to={`/projects/${project.id}`}
                                            className={`sidebar-item sidebar-item-nested ${isProjectActive(project.id) ? 'sidebar-item-active' : ''}`}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-[--accent-cyan] shrink-0"></div>
                                            <span className="sidebar-label truncate">{project.name}</span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </nav>

                {/* User Section */}
                <div className="sidebar-footer">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="sidebar-user-btn"
                        >
                            <div className={`avatar avatar-sm bg-linear-to-br ${getAvatarColor(userProfile?.name)} text-white`}>
                                {getInitials(userProfile?.name)}
                            </div>
                            <div className="sidebar-label flex-1 text-left min-w-0">
                                <div className="text-sm font-medium text-[--text-primary] truncate">
                                    {userProfile?.name}
                                </div>
                                <div className="text-xs text-[--text-muted] truncate">
                                    {isAdmin ? 'Admin' : 'Member'}
                                </div>
                            </div>
                            <svg
                                className={`w-4 h-4 text-[--text-muted] transition-transform sidebar-label ${showUserMenu ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>

                        {showUserMenu && (
                            <div className="sidebar-user-menu">
                                <div className="px-3 py-2 border-b border-[--glass-border]">
                                    <div className="text-sm font-medium text-[--text-primary]">{userProfile?.name}</div>
                                    <div className="text-xs text-[--text-muted] break-all">{userProfile?.email}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[--accent-red] hover:bg-[--accent-red]/10 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
