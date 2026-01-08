import { useUsers } from '../context/UsersContext';
import { getRelativeTime, formatActivityEvent, getInitials, getAvatarColor } from '../utils/helpers';

export default function ActivityLog({ activities = [] }) {
    const { getUserName } = useUsers();

    // Sort activities by timestamp, newest first
    const sortedActivities = activities && activities.length > 0
        ? [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        : [];

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-[--text-primary] flex items-center space-x-2">
                <svg className="w-5 h-5 text-[--accent-cyan]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Activity</span>
                <span className="badge badge-cyan">{activities?.length || 0}</span>
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
                {sortedActivities.length === 0 ? (
                    <div className="text-center py-6">
                        <svg className="w-12 h-12 mx-auto text-[--text-muted] opacity-40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm text-[--text-muted]">No activity yet</p>
                    </div>
                ) : (
                    sortedActivities.map((activity, index) => {
                        const userName = getUserName(activity.userId);
                        return (
                            <div key={index} className="flex items-start space-x-3 animate-fade-in">
                                <div className="relative shrink-0">
                                    <div className={`avatar avatar-sm bg-linear-to-br ${getAvatarColor(userName)} text-white text-[10px]`}>
                                        {getInitials(userName)}
                                    </div>
                                    {/* Timeline line */}
                                    {index < sortedActivities.length - 1 && (
                                        <div className="absolute top-7 left-1/2 w-px h-6 bg-[--glass-border] -translate-x-1/2"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 pb-4">
                                    <div className="text-sm">
                                        <span className="font-medium text-[--text-primary]">
                                            {userName}
                                        </span>{' '}
                                        <span className="text-[--text-muted]">
                                            {formatActivityEvent(activity.eventType, activity.metadata)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-[--text-muted] mt-0.5">
                                        {getRelativeTime(activity.timestamp)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
