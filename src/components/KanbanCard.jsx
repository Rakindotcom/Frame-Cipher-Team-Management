import { Link } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import { getInitials, getAvatarColor, getPriorityDotClass, formatCountdown, isOverdue } from '../utils/helpers';

export default function KanbanCard({ task }) {
    const { getUserName } = useUsers();
    const assigneeName = getUserName(task.assignedTo);
    const overdue = isOverdue(task.deadline) && task.status !== 'done';

    return (
        <Link
            to={`/tasks/${task.id}`}
            className="kanban-card"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Priority & Title */}
            <div className="flex items-start gap-2 mb-1.5">
                <div className={`priority-dot mt-1.5 shrink-0 ${getPriorityDotClass(task.priority)}`}></div>
                <h4 className="text-sm font-medium text-[--text-primary] line-clamp-2">
                    {task.title}
                </h4>
            </div>

            {/* Description Preview */}
            {task.description && (
                <p className="text-xs text-[--text-muted] line-clamp-2 mb-2 pl-4">
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pl-4">
                {/* Assignee */}
                <div className="flex items-center space-x-1">
                    <div className={`avatar avatar-sm bg-linear-to-br ${getAvatarColor(assigneeName)} text-white text-[9px]`}>
                        {getInitials(assigneeName)}
                    </div>
                    <span className="text-xs text-[--text-muted] truncate max-w-[60px]">
                        {assigneeName?.split(' ')[0]}
                    </span>
                </div>

                {/* Due Date */}
                {task.deadline && (
                    <span className={`text-xs flex items-center space-x-1 ${overdue ? 'text-[--accent-red]' : 'text-[--text-muted]'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{overdue ? 'Overdue' : formatCountdown(task.deadline)}</span>
                    </span>
                )}
            </div>

            {/* Subtasks / Comments indicator */}
            {(task.comments?.length > 0) && (
                <div className="flex items-center space-x-2 mt-1.5 pl-4 text-xs text-[--text-muted]">
                    {task.comments?.length > 0 && (
                        <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>{task.comments.length}</span>
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}
