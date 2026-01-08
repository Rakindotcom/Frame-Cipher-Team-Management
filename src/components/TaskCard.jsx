import { Link } from 'react-router-dom';
import { formatDate, getStatusColor, getPriorityDotClass, isOverdue, formatCountdown } from '../utils/helpers';
import { useUsers } from '../context/UsersContext';
import { getInitials, getAvatarColor } from '../utils/helpers';

export default function TaskCard({ task, showProject = false }) {
    const { getUserName } = useUsers();
    const overdue = isOverdue(task.deadline) && task.status !== 'done';
    const assigneeName = getUserName(task.assignedTo);

    return (
        <Link
            to={`/tasks/${task.id}`}
            className="group block p-4 rounded-xl bg-[--bg-primary]/50 border border-[--glass-border] hover:border-[--glass-border-hover] hover:bg-[--bg-tertiary]/30 transition-all duration-200"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2 min-w-0">
                    {/* Priority Dot */}
                    <div className={`priority-dot mt-1.5 shrink-0 ${getPriorityDotClass(task.priority)}`}></div>
                    <h4 className="font-medium text-[--text-primary] group-hover:text-[--accent-cyan] transition-colors line-clamp-1">
                        {task.title}
                    </h4>
                </div>
                <span className={`badge text-xs whitespace-nowrap ${getStatusColor(task.status)}`}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-[--text-muted] mb-3 line-clamp-2 pl-5">
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pl-5">
                <div className="flex items-center space-x-3">
                    {/* Assignee Avatar */}
                    <div className="tooltip-container">
                        <div className={`avatar avatar-sm bg-linear-to-br ${getAvatarColor(assigneeName)} text-white text-[10px]`}>
                            {getInitials(assigneeName)}
                        </div>
                        <div className="tooltip">{assigneeName}</div>
                    </div>

                    {/* Comments Count */}
                    {task.comments?.length > 0 && (
                        <span className="flex items-center space-x-1 text-xs text-[--text-muted]">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>{task.comments.length}</span>
                        </span>
                    )}
                </div>

                {/* Due Date */}
                {task.deadline && (
                    <div className={`flex items-center space-x-1.5 text-xs ${overdue
                            ? 'text-[--accent-red]'
                            : 'text-[--text-muted]'
                        }`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={overdue ? 'font-medium' : ''}>
                            {overdue ? 'Overdue' : formatCountdown(task.deadline)}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}
