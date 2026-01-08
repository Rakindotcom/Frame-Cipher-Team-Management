/**
 * Format date to readable string
 * @param {Date|Object|string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
    if (!date) return '';

    // Handle Firestore Timestamp
    if (date?.toDate) {
        date = date.toDate();
    } else if (typeof date === 'string') {
        date = new Date(date);
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

/**
 * Format date with time
 * @param {Date|Object|string} date 
 * @returns {string}
 */
export const formatDateTime = (date) => {
    if (!date) return '';

    // Handle Firestore Timestamp
    if (date?.toDate) {
        date = date.toDate();
    } else if (typeof date === 'string') {
        date = new Date(date);
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date|Object|string} date 
 * @returns {string}
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    // Handle Firestore Timestamp
    if (date?.toDate) {
        date = date.toDate();
    } else if (typeof date === 'string') {
        date = new Date(date);
    }

    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(date);
};

/**
 * Check if deadline is overdue
 * @param {string} deadline - ISO date string
 * @returns {boolean}
 */
export const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
};

/**
 * Get countdown to deadline
 * @param {string} deadline - ISO date string
 * @returns {string}
 */
export const formatCountdown = (deadline) => {
    if (!deadline) return '';

    const now = new Date();
    const target = new Date(deadline);
    const diffMs = target - now;

    if (diffMs < 0) return 'Overdue';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) return `${diffDays}d left`;
    if (diffHours > 0) return `${diffHours}h left`;
    return 'Due soon';
};

/**
 * Get priority color class (for dark theme)
 * @param {string} priority 
 * @returns {string}
 */
export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high': return 'bg-[--accent-red]/15 text-[--accent-red] border border-[--accent-red]/30';
        case 'medium': return 'bg-[--accent-yellow]/15 text-[--accent-yellow] border border-[--accent-yellow]/30';
        case 'low': return 'bg-[--accent-yellow]/15 text-[--accent-yellow] border border-[--accent-yellow]/30';
        default: return 'bg-[--bg-tertiary] text-[--text-muted]';
    }
};

/**
 * Get status color class (for dark theme)
 * @param {string} status 
 * @returns {string}
 */
export const getStatusColor = (status) => {
    switch (status) {
        case 'done': return 'bg-[--accent-yellow]/15 text-[--accent-yellow] border border-[--accent-yellow]/30';
        case 'in-progress': return 'bg-[--accent-cyan]/15 text-[--accent-cyan] border border-[--accent-cyan]/30';
        case 'review': return 'bg-[--accent-purple]/15 text-[--accent-purple] border border-[--accent-purple]/30';
        case 'need-fixing': return 'bg-[--accent-yellow]/15 text-[--accent-yellow] border border-[--accent-yellow]/30';
        case 'todo': return 'bg-[--bg-tertiary] text-[--text-muted] border border-[--glass-border]';
        default: return 'bg-[--bg-tertiary] text-[--text-muted]';
    }
};

/**
 * Truncate text to specified length
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/**
 * Get initials from name
 * @param {string} name 
 * @returns {string}
 */
export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

/**
 * Get time-based greeting (psychologically accurate ranges)
 * Morning: 5:00am - 10:59am (morning energy is real)
 * Afternoon: 11:00am - 4:59pm (post-lunch, mid-workday)
 * Evening: 5:00pm - 7:59pm (sunset, commute home)
 * Night: 8:00pm - 4:59am (winding down time)
 * @returns {string}
 */
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Good morning';
    if (hour >= 11 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 20) return 'Good evening';
    return 'Good night';
};

/**
 * Get consistent avatar color based on name hash
 * @param {string} name 
 * @returns {string}
 */
export const getAvatarColor = (name) => {
    if (!name) return 'from-gray-500 to-gray-600';

    const colors = [
        'from-[--accent-cyan] to-blue-500',
        'from-[--accent-purple] to-purple-600',
        'from-[--accent-pink] to-rose-500',
        'from-[--accent-yellow] to-yellow-500',
        'from-[--accent-yellow] to-orange-500',
        'from-blue-500 to-indigo-600',
        'from-teal-500 to-cyan-500',
        'from-rose-500 to-pink-600'
    ];

    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};

/**
 * Get priority dot class
 * @param {string} priority 
 * @returns {string}
 */
export const getPriorityDotClass = (priority) => {
    switch (priority) {
        case 'high': return 'priority-dot-high';
        case 'medium': return 'priority-dot-medium';
        case 'low': return 'priority-dot-low';
        default: return 'bg-[--text-muted]';
    }
};

/**
 * Format activity event to readable text
 * @param {string} eventType 
 * @param {Object} metadata 
 * @returns {string}
 */
export const formatActivityEvent = (eventType, metadata) => {
    switch (eventType) {
        case 'task_created':
            return `created task "${metadata?.title || 'Untitled'}"`;
        case 'task_updated':
            if (metadata?.status) return `changed status to "${metadata.status}"`;
            if (metadata?.priority) return `changed priority to "${metadata.priority}"`;
            if (metadata?.assignedTo) return 'reassigned the task';
            return 'updated the task';
        case 'comment_added':
            return 'added a comment';
        case 'status_changed':
            return `changed status to "${metadata?.status || 'unknown'}"`;
        default:
            return eventType.replace(/_/g, ' ');
    }
};
