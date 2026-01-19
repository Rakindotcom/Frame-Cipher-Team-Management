import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import { useTasks } from '../context/TasksContext';
import { getGreeting } from '../utils/helpers';

export default function DashboardPage() {
    const { userProfile, isAdmin } = useAuth();
    const { projects } = useProjects();
    const { tasks, getMyTasks } = useTasks();

    const myTasks = getMyTasks();
    const pendingTasks = myTasks.filter(t => t.status !== 'done');
    const completedTasks = myTasks.filter(t => t.status === 'done');
    const completionRate = myTasks.length > 0 ? Math.round((completedTasks.length / myTasks.length) * 100) : 0;

    // Stats with icons
    const stats = [
        {
            label: 'Total Projects',
            value: projects.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
            color: 'cyan'
        },
        {
            label: 'My Tasks',
            value: myTasks.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            color: 'cyan'
        },
        {
            label: 'Pending',
            value: pendingTasks.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'yellow'
        },
        {
            label: 'Completed',
            value: completedTasks.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'yellow'
        }
    ];

    const recentTasks = pendingTasks.slice(0, 5);
    const statusColors = {
        todo: 'from-gray-500 to-gray-600',
        'in-progress': 'from-purple-300 to-purple-400',
        review: 'from-purple-300 to-purple-400',
        'need-fixing': 'from-[--accent-yellow] to-orange-500',
        done: 'from-[--accent-yellow] to-yellow-600'
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[--text-primary]">
                            {getGreeting()}, <span className="text-yellow-600">{userProfile?.name?.split(' ')[0] || 'there'}</span>!
                        </h1>
                        <p className="text-[--text-muted] mt-1">
                            Here's what's happening with your projects today
                        </p>
                    </div>
                    <Link
                        to="/projects"
                        className="btn-primary inline-flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>New Project</span>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="stat-card"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`inline-flex p-2 rounded-lg bg-[--accent-${stat.color}]/10 text-[--accent-${stat.color}] mb-3`}>
                                {stat.icon}
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Progress Ring Section */}
                {myTasks.length > 0 && (
                    <div className="glass-card-static p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="relative w-32 h-32 shrink-0">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-[--bg-tertiary]"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={352}
                                        strokeDashoffset={352 - (352 * completionRate / 100)}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6b7280" />
                                            <stop offset="100%" stopColor="#9ca3af" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gradient">{completionRate}%</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[--text-primary] mb-1">Task Completion</h3>
                                <p className="text-[--text-muted] text-sm flex items-center gap-1 flex-wrap">
                                    You've completed {completedTasks.length} out of {myTasks.length} tasks.
                                    {completionRate >= 75 ? (
                                        <span className="inline-flex items-center gap-1 text-[--accent-yellow]"> Great job!
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </span>
                                    ) : completionRate >= 50 ? (
                                        <span className="inline-flex items-center gap-1 text-[--accent-cyan]"> Keep going!
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[--accent-cyan]"> You got this!
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Projects */}
                    <div className="glass-card-static p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-[--text-primary] flex items-center space-x-2">
                                <svg className="w-5 h-5 text-[--accent-cyan]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <span>Projects</span>
                            </h2>
                            <Link
                                to="/projects"
                                className="text-sm text-[--accent-cyan] hover:text-[--accent-cyan] transition-colors"
                            >
                                View all →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {projects.length === 0 ? (
                                <div className="empty-state py-8">
                                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    <p className="empty-state-title">No projects yet</p>
                                    <p className="empty-state-description">Create your first project to get started</p>
                                </div>
                            ) : (
                                projects.slice(0, 5).map((project) => (
                                    <Link
                                        key={project.id}
                                        to={`/projects/${project.id}`}
                                        className="block p-4 rounded-lg bg-[--bg-primary]/50 border border-[--glass-border] hover:border-[--glass-border-hover] hover:bg-[--bg-tertiary]/30 transition-all duration-200"
                                    >
                                        <div className="font-medium text-[--text-primary] mb-1">
                                            {project.name}
                                        </div>
                                        {project.description && (
                                            <div className="text-sm text-[--text-muted] line-clamp-1">
                                                {project.description}
                                            </div>
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* My Pending Tasks */}
                    <div className="glass-card-static p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-[--text-primary] flex items-center space-x-2">
                                <svg className="w-5 h-5 text-[--accent-cyan]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>My Pending Tasks</span>
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {recentTasks.length === 0 ? (
                                <div className="empty-state py-8">
                                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="empty-state-title">All caught up!</p>
                                    <p className="empty-state-description">No pending tasks for you</p>
                                </div>
                            ) : (
                                recentTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Admin: Team Tasks Overview */}
                {isAdmin && (
                    <div className="glass-card-static p-6">
                        <h2 className="font-semibold text-[--text-primary] mb-4 flex items-center space-x-2">
                            <svg className="w-5 h-5 text-[--accent-yellow]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Team Tasks Overview</span>
                            <span className="badge badge-cyan">{tasks.length} total</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                {
                                    status: 'todo', label: 'To Do', icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    )
                                },
                                {
                                    status: 'in-progress', label: 'In Progress', icon: (
                                        <svg className="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    )
                                },
                                {
                                    status: 'review', label: 'Review', icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )
                                },
                                {
                                    status: 'need-fixing', label: 'Need Fixing', icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    )
                                },
                                {
                                    status: 'done', label: 'Done', icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )
                                }
                            ].map(({ status, label, icon }) => {
                                const count = tasks.filter(t => t.status === status).length;
                                return (
                                    <div
                                        key={status}
                                        className="p-4 rounded-xl bg-[--bg-primary]/50 border border-[--glass-border] text-center"
                                    >
                                        <div className={`mb-1 flex justify-center text-[--text-muted]`}>{icon}</div>
                                        <div className={`text-2xl font-bold bg-linear-to-r ${statusColors[status]} bg-clip-text text-transparent`}>
                                            {count}
                                        </div>
                                        <div className="text-xs text-[--text-muted] mt-1">
                                            {label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
