import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '../utils/helpers';
import { useTasks } from '../context/TasksContext';

export default function ProjectCard({ project }) {
    const { getTasksByProject } = useTasks();
    const tasks = getTasksByProject(project.id);

    const taskStats = {
        total: tasks.length,
        done: tasks.filter(t => t.status === 'done').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length
    };

    const progressPercent = taskStats.total > 0
        ? Math.round((taskStats.done / taskStats.total) * 100)
        : 0;

    return (
        <Link
            to={`/projects/${project.id}`}
            className="group block glass-card p-5 hover:border-[--accent-cyan]/30"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <h3 className="font-semibold text-[--text-primary] group-hover:text-gradient transition-all duration-300">
                        {project.name}
                    </h3>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-xs text-[--text-muted]">{progressPercent}%</span>
                </div>
            </div>

            {/* Description */}
            {project.description && (
                <p className="text-sm text-[--text-muted] mb-4 line-clamp-2">
                    {truncateText(project.description, 100)}
                </p>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1.5 text-[--text-muted]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{taskStats.total} tasks</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-[--accent-yellow]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{taskStats.done} done</span>
                    </span>
                </div>
                <span className="text-xs text-[--text-muted]">
                    {formatDate(project.createdAt)}
                </span>
            </div>
        </Link>
    );
}
