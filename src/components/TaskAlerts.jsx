import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import { useTasks } from '../context/TasksContext';

const MEMBER_ALERT_STATUSES = ['todo', 'need-fixing'];
const STATUS_LABELS = {
    todo: 'To Do',
    'need-fixing': 'Need Fixing',
    review: 'Ready to Review'
};

export default function TaskAlerts() {
    const { user, isAdmin } = useAuth();
    const { tasks } = useTasks();
    const { projects } = useProjects();

    const alertTasks = isAdmin
        ? tasks.filter((task) => task.status === 'review')
        : tasks.filter((task) =>
            task.assignedTo === user?.uid && MEMBER_ALERT_STATUSES.includes(task.status)
        );

    if (alertTasks.length === 0) return null;

    const visibleAlerts = alertTasks.slice(0, 3);
    const remainingCount = alertTasks.length - visibleAlerts.length;

    const getProjectName = (projectId) => {
        return projects.find((project) => project.id === projectId)?.name || 'Project';
    };

    return (
        <section className="mb-6 rounded-lg border border-[--accent-yellow]/30 bg-[--accent-yellow]/10 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-[--accent-yellow]/15 p-2 text-[--accent-yellow]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[--text-primary]">
                            {isAdmin ? 'Tasks ready for review' : 'Assigned tasks need attention'}
                        </h2>
                        <p className="text-xs text-[--text-muted] mt-1">
                            {isAdmin
                                ? `${alertTasks.length} task${alertTasks.length !== 1 ? 's are' : ' is'} waiting for admin review.`
                                : `${alertTasks.length} assigned task${alertTasks.length !== 1 ? 's need' : ' needs'} your attention.`
                            }
                        </p>
                    </div>
                </div>

                <div className="grid gap-2 lg:min-w-[24rem]">
                    {visibleAlerts.map((task) => (
                        <Link
                            key={task.id}
                            to={`/tasks/${task.id}`}
                            className="rounded-lg border border-[--glass-border] bg-[--bg-primary]/60 px-3 py-2 transition-colors hover:border-[--accent-yellow]/40 hover:bg-[--bg-tertiary]/40"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-[--text-primary] line-clamp-1">
                                    {task.title}
                                </span>
                                <span className="badge badge-yellow text-[10px] shrink-0">
                                    {STATUS_LABELS[task.status] || task.status}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-[--text-muted] line-clamp-1">
                                {getProjectName(task.projectId)}
                            </p>
                        </Link>
                    ))}
                    {remainingCount > 0 && (
                        <Link
                            to="/projects"
                            className="text-xs font-medium text-[--accent-yellow] hover:text-[--text-primary] transition-colors"
                        >
                            View {remainingCount} more task{remainingCount !== 1 ? 's' : ''}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
