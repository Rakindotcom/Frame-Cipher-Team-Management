import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ProjectForm from '../components/ProjectForm';
import KanbanBoard from '../components/KanbanBoard';
import Modal from '../components/Modal';
import { useProjects } from '../context/ProjectsContext';
import { useTasks } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { fetchProject, editProject, removeProject } = useProjects();
    const { getTasksByProject, addTask } = useTasks();
    const { isAdmin } = useAuth();
    const { confirm } = useConfirm();
    const { addToast } = useToast();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'
    const [newTaskStatus, setNewTaskStatus] = useState('todo');

    useEffect(() => {
        loadProject();
    }, [projectId]);

    // Load view preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('projectViewMode');
        if (saved) setViewMode(saved);
    }, []);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('projectViewMode', mode);
    };

    const loadProject = async () => {
        try {
            const data = await fetchProject(projectId);
            if (!data) {
                navigate('/projects');
                return;
            }
            setProject(data);
        } catch (error) {
            console.error('Error loading project:', error);
            navigate('/projects');
        } finally {
            setLoading(false);
        }
    };

    const tasks = getTasksByProject(projectId);
    const taskStats = {
        total: tasks.length,
        done: tasks.filter(t => t.status === 'done').length
    };
    const progressPercent = taskStats.total > 0
        ? Math.round((taskStats.done / taskStats.total) * 100)
        : 0;

    const handleCreateTask = async (taskData) => {
        await addTask(taskData);
        setShowTaskModal(false);
    };

    const handleAddTaskFromColumn = (status) => {
        setNewTaskStatus(status);
        setShowTaskModal(true);
    };

    const handleEditProject = async (updates) => {
        await editProject(projectId, updates);
        setProject({ ...project, ...updates });
        setShowEditModal(false);
    };

    const handleDeleteProject = async () => {
        const confirmed = await confirm({
            title: 'Delete Project',
            message: 'Are you sure you want to delete this project? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        
        if (!confirmed) return;
        
        try {
            await removeProject(projectId);
            addToast('Project deleted successfully', 'success');
            navigate('/projects');
        } catch (error) {
            addToast('Failed to delete project', 'error');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="spinner spinner-lg mx-auto mb-4"></div>
                        <p className="text-[--text-muted]">Loading project...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!project) {
        return (
            <Layout>
                <div className="glass-card-static p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-[--text-muted] opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[--text-muted]">Project not found</p>
                    <Link to="/projects" className="btn-primary inline-block mt-4">
                        Back to Projects
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header Bar - Mobile Responsive */}
                <div className="flex flex-col gap-4">
                    {/* Title & Breadcrumb */}
                    <div className="flex items-start gap-3">
                        <Link
                            to="/projects"
                            className="p-2 rounded-lg hover:bg-[--bg-tertiary] text-[--text-muted] hover:text-[--text-primary] transition-colors shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h1 className="text-lg sm:text-xl font-bold text-[--text-primary]">{project.name}</h1>
                            </div>
                            {project.description && (
                                <p className="text-sm text-[--text-muted] line-clamp-2">{project.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions - Mobile Responsive */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* View Toggle */}
                        <div className="view-toggle">
                            <button
                                onClick={() => handleViewChange('board')}
                                className={`view-toggle-btn ${viewMode === 'board' ? 'view-toggle-btn-active' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                                <span className="hidden sm:inline">Board</span>
                            </button>
                            <button
                                onClick={() => handleViewChange('list')}
                                className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-btn-active' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                <span className="hidden sm:inline">List</span>
                            </button>
                        </div>

                        {/* Progress - Mobile: Full width, Desktop: Inline */}
                        <div className="flex sm:hidden w-full items-center gap-2 text-sm px-1">
                            <span className="text-[--text-muted] text-xs">{progressPercent}%</span>
                            <div className="flex-1 h-1.5 bg-[--bg-tertiary] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-[--accent-cyan] to-[--accent-cyan] rounded-full transition-all"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <span className="text-[--text-muted] text-xs">{taskStats.done}/{taskStats.total}</span>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <span className="text-[--text-muted]">{progressPercent}%</span>
                            <div className="w-24 h-1.5 bg-[--bg-tertiary] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-[--accent-cyan] to-[--accent-cyan] rounded-full transition-all"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Add Task - Mobile: Icon only, Desktop: With text */}
                        <button
                            onClick={() => setShowTaskModal(true)}
                            className="btn-primary inline-flex items-center justify-center space-x-2 flex-1 sm:flex-initial"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>New Task</span>
                        </button>

                        {/* Project Menu */}
                        {isAdmin && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="p-2 rounded-lg hover:bg-[--bg-tertiary] text-[--text-muted] hover:text-[--text-primary] transition-colors"
                                    title="Edit project"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleDeleteProject}
                                    className="p-2 rounded-lg hover:bg-[--accent-red]/10 text-[--text-muted] hover:text-[--accent-red] transition-colors"
                                    title="Delete project"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Board View */}
                {viewMode === 'board' && (
                    <KanbanBoard
                        projectId={projectId}
                        onAddTask={handleAddTaskFromColumn}
                    />
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                            <div className="glass-card-static">
                                <div className="empty-state py-12">
                                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <p className="empty-state-title">No tasks yet</p>
                                    <p className="empty-state-description">
                                        Create your first task to get started
                                    </p>
                                    <button
                                        onClick={() => setShowTaskModal(true)}
                                        className="btn-primary mt-4"
                                    >
                                        Create First Task
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {tasks.map((task, index) => (
                                    <div
                                        key={task.id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <TaskCard task={task} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            <Modal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                title="New Task"
                size="lg"
            >
                <TaskForm
                    projectId={projectId}
                    defaultStatus={newTaskStatus}
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowTaskModal(false)}
                />
            </Modal>

            {/* Edit Project Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Project"
            >
                <ProjectForm
                    initialData={project}
                    onSubmit={handleEditProject}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>
        </Layout>
    );
}
