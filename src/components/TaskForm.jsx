import { useState, useEffect } from 'react';
import { useUsers } from '../context/UsersContext';
import { useAuth } from '../context/AuthContext';

export default function TaskForm({ projectId, initialData, defaultStatus = 'todo', onSubmit, onCancel }) {
    const { users } = useUsers();
    const { user } = useAuth();

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [priority, setPriority] = useState(initialData?.priority || 'medium');
    const [status, setStatus] = useState(initialData?.status || defaultStatus);
    const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo || user?.uid || '');
    const [deadline, setDeadline] = useState(initialData?.deadline || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assignedTo && user?.uid) {
            setAssignedTo(user.uid);
        }
    }, [user?.uid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const taskData = {
                title,
                description,
                priority,
                status,
                assignedTo,
                deadline: deadline || null,
                projectId: projectId || initialData?.projectId
            };
            await onSubmit(taskData);
        } finally {
            setLoading(false);
        }
    };

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-[--accent-yellow]' },
        { value: 'medium', label: 'Medium', color: 'text-[--accent-yellow]' },
        { value: 'high', label: 'High', color: 'text-[--accent-red]' }
    ];

    const statuses = [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'review', label: 'Review' },
        { value: 'need-fixing', label: 'Need Fixing' },
        { value: 'done', label: 'Done' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Task Title <span className="text-[--accent-red]">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. Design homepage mockup"
                    required
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea-dark"
                    placeholder="Add more details about this task..."
                    rows={3}
                />
            </div>

            {/* Two Column Layout - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="select-dark"
                    >
                        {priorities.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="select-dark"
                    >
                        {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Two Column Layout - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assignee */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Assign To
                    </label>
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="select-dark"
                    >
                        <option value="">Select team member</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="input-dark"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            {/* Actions - Mobile Responsive */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-ghost w-full sm:w-auto"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
                    disabled={loading || !title.trim()}
                >
                    {loading ? (
                        <>
                            <div className="spinner spinner-sm"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{initialData ? 'Update Task' : 'Create Task'}</span>
                    )}
                </button>
            </div>
        </form>
    );
}
