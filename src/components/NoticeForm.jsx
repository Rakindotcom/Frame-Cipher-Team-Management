import { useState } from 'react';
import { useNotices } from '../context/NoticesContext';
import { useToast } from './Toast';

export default function NoticeForm({ initialData, onCancel, onSuccess }) {
    const { addNotice, editNotice } = useNotices();
    const { addToast } = useToast();
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [priority, setPriority] = useState(initialData?.priority || 'normal');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const noticeData = { title, content, priority };
            
            if (initialData) {
                await editNotice(initialData.id, noticeData);
                addToast('Notice updated successfully', 'success');
            } else {
                await addNotice(noticeData);
                addToast('Notice created successfully', 'success');
            }
            onSuccess();
        } catch (error) {
            addToast('Failed to save notice', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Title <span className="text-[--accent-red]">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. Office closure on Friday"
                    required
                />
            </div>

            {/* Content */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Content <span className="text-[--accent-red]">*</span>
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="textarea-dark"
                    placeholder="Write your announcement here..."
                    rows={6}
                    required
                />
            </div>

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
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>

            {/* Actions */}
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
                    disabled={loading || !title.trim() || !content.trim()}
                >
                    {loading ? (
                        <>
                            <div className="spinner spinner-sm"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{initialData ? 'Update Notice' : 'Post Notice'}</span>
                    )}
                </button>
            </div>
        </form>
    );
}
