import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';
import CommentSection from '../components/CommentSection';
import ActivityLog from '../components/ActivityLog';
import Modal from '../components/Modal';
import { useTasks } from '../context/TasksContext';
import { useProjects } from '../context/ProjectsContext';
import { useUsers } from '../context/UsersContext';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { formatDate, getPriorityColor, getStatusColor, isOverdue, getInitials, getAvatarColor, formatCountdown, getPriorityDotClass } from '../utils/helpers';
import { TASK_STATUSES } from '../types';

export default function TaskDetailPage() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { subscribeToSingleTask, editTask, removeTask } = useTasks();
    const { fetchProject } = useProjects();
    const { getUserName } = useUsers();
    const { userProfile, isAdmin } = useAuth();
    const { confirm } = useConfirm();
    const { addToast } = useToast();

    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToSingleTask(taskId, async (taskData) => {
            if (!taskData) {
                navigate('/projects');
                return;
            }
            setTask(taskData);

            // Fetch project info
            if (taskData.projectId) {
                const projectData = await fetchProject(taskData.projectId);
                setProject(projectData);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [taskId]);

    const handleStatusChange = async (newStatus) => {
        await editTask(taskId, { status: newStatus }, 'status_changed');
    };

    const handleEditTask = async (updates) => {
        await editTask(taskId, updates);
        setShowEditModal(false);
    };

    const handleDeleteTask = async () => {
        const confirmed = await confirm({
            title: 'Delete Task',
            message: 'Are you sure you want to delete this task?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        
        if (!confirmed) return;
        
        try {
            await removeTask(taskId);
            addToast('Task deleted successfully', 'success');
            navigate(`/projects/${task.projectId}`);
        } catch (error) {
            addToast('Failed to delete task', 'error');
        }
    };

    const canEdit = isAdmin || userProfile?.id === task?.assignedTo || userProfile?.id === task?.createdBy;
    const overdue = task && isOverdue(task.deadline) && task.status !== 'done';
    const assigneeName = task ? getUserName(task.assignedTo) : '';

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="spinner spinner-lg mx-auto mb-4"></div>
                        <p className="text-[--text-muted]">Loading task...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!task) {
        return (
            <Layout>
                <div className="glass-card-static p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-[--text-muted] opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[--text-muted]">Task not found</p>
                    <Link to="/projects" className="btn-primary inline-block mt-4">
                        Back to Projects
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-[--text-muted]">
                    <Link to="/projects" className="hover:text-[--accent-cyan] transition-colors flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span>Projects</span>
                    </Link>
                    <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {project && (
                        <>
                            <Link to={`/projects/${project.id}`} className="hover:text-[--accent-cyan] transition-colors">
                                {project.name}
                            </Link>
                            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </>
                    )}
                    <span className="text-[--text-primary] font-medium line-clamp-1">{task.title}</span>
                </div>

                {/* Task Header */}
                <div className="glass-card-static p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                                <div className={`priority-dot mt-2 ${getPriorityDotClass(task.priority)}`}></div>
                                <h1 className="text-2xl font-bold text-gradient">{task.title}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`badge ${getPriorityColor(task.priority)}`}>
                                    {task.priority} priority
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className={`avatar avatar-sm bg-linear-to-br ${getAvatarColor(assigneeName)} text-white text-[10px]`}>
                                        {getInitials(assigneeName)}
                                    </div>
                                    <span className="text-sm text-[--text-secondary]">
                                        {assigneeName}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {canEdit && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="btn-secondary inline-flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Edit</span>
                                </button>
                                {isAdmin && (
                                    <button
                                        onClick={handleDeleteTask}
                                        className="btn-danger inline-flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Delete</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Status & Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[--bg-primary]/50 border border-[--glass-border]">
                        {/* Status */}
                        <div>
                            <label className="block text-xs text-[--text-muted] mb-2">Status</label>
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={!canEdit}
                                className="select-dark py-2 text-sm"
                            >
                                {TASK_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-xs text-[--text-muted] mb-2">Deadline</label>
                            {task.deadline ? (
                                <div className={`text-sm font-medium ${overdue ? 'text-[--accent-red]' : 'text-[--text-primary]'}`}>
                                    <div className="flex items-center space-x-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDate(task.deadline)}</span>
                                    </div>
                                    {overdue ? (
                                        <span className="text-xs text-[--accent-red]">Overdue!</span>
                                    ) : (
                                        <span className="text-xs text-[--text-muted]">{formatCountdown(task.deadline)}</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-sm text-[--text-muted]">No deadline</span>
                            )}
                        </div>

                        {/* Created */}
                        <div>
                            <label className="block text-xs text-[--text-muted] mb-2">Created</label>
                            <span className="text-sm text-[--text-primary]">{formatDate(task.createdAt)}</span>
                        </div>

                        {/* Project */}
                        <div>
                            <label className="block text-xs text-[--text-muted] mb-2">Project</label>
                            {project ? (
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="text-sm text-[--accent-cyan] hover:text-[--accent-cyan] transition-colors"
                                >
                                    {project.name}
                                </Link>
                            ) : (
                                <span className="text-sm text-[--text-muted]">-</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="mt-6 pt-6 border-t border-[--glass-border]">
                            <h3 className="text-sm font-medium text-[--text-secondary] mb-3 flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                <span>Description</span>
                            </h3>
                            <p className="text-[--text-secondary] whitespace-pre-wrap leading-relaxed">{task.description}</p>
                        </div>
                    )}
                </div>

                {/* Comments & Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card-static p-6">
                        <CommentSection taskId={taskId} comments={task.comments || []} />
                    </div>
                    <div className="glass-card-static p-6">
                        <ActivityLog activities={task.activity || []} />
                    </div>
                </div>
            </div>

            {/* Edit Task Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Task"
                size="lg"
            >
                <TaskForm
                    projectId={task.projectId}
                    initialData={task}
                    onSubmit={handleEditTask}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>
        </Layout>
    );
}
