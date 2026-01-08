import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext';
import { useNotices } from '../context/NoticesContext';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import { formatDate, getInitials, getAvatarColor } from '../utils/helpers';
import Modal from './Modal';
import NoticeForm from './NoticeForm';

export default function NoticeCard({ notice }) {
    const { userProfile, isAdmin } = useAuth();
    const { getUserName } = useUsers();
    const { addComment, removeNotice } = useNotices();
    const { addToast } = useToast();
    const { confirm } = useConfirm();
    const [showComments, setShowComments] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const authorName = getUserName(notice.createdBy);
    const comments = notice.comments || [];

    const priorityColors = {
        low: 'badge-gray',
        normal: 'badge-cyan',
        high: 'badge-yellow',
        urgent: 'badge-red'
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            await addComment(notice.id, {
                text: comment.trim(),
                userId: userProfile.id
            });
            setComment('');
            addToast('Comment added', 'success');
        } catch (error) {
            addToast('Failed to add comment', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete Notice',
            message: 'Are you sure you want to delete this notice? This action cannot be undone.',
            confirmText: 'Delete',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            await removeNotice(notice.id);
            addToast('Notice deleted successfully', 'success');
        } catch (error) {
            addToast('Failed to delete notice', 'error');
        }
    };

    return (
        <>
            <div className="glass-card-static p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`avatar avatar-md bg-linear-to-br ${getAvatarColor(authorName)} text-white shrink-0`}>
                            {getInitials(authorName)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-[--text-primary] text-base sm:text-lg">
                                    {notice.title}
                                </h3>
                                <span className={`badge ${priorityColors[notice.priority]}`}>
                                    {notice.priority}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-[--text-muted] mt-1">
                                <span>{authorName}</span>
                                <span>•</span>
                                <span>{formatDate(notice.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {isAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="p-2 rounded-lg hover:bg-[--bg-tertiary] text-[--text-muted] hover:text-[--text-primary] transition-colors"
                                title="Edit notice"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 rounded-lg hover:bg-[--accent-red]/10 text-[--text-muted] hover:text-[--accent-red] transition-colors"
                                title="Delete notice"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="text-[--text-secondary] text-sm sm:text-base whitespace-pre-wrap mb-4">
                    {notice.content}
                </div>

                {/* Comments Section */}
                <div className="border-t border-[--glass-border] pt-4">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-sm text-[--text-muted] hover:text-[--text-primary] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
                        <svg className={`w-4 h-4 transition-transform ${showComments ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showComments && (
                        <div className="mt-4 space-y-4">
                            {/* Add Comment */}
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="input-dark flex-1"
                                    disabled={submitting}
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !comment.trim()}
                                    className="btn-primary shrink-0"
                                >
                                    {submitting ? (
                                        <div className="spinner spinner-sm"></div>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    )}
                                </button>
                            </form>

                            {/* Comments List */}
                            {comments.length > 0 && (
                                <div className="space-y-3">
                                    {comments.map((c) => {
                                        const commenterName = getUserName(c.userId);
                                        return (
                                            <div key={c.id} className="flex gap-3 p-3 rounded-lg bg-[--bg-primary]">
                                                <div className={`avatar avatar-sm bg-linear-to-br ${getAvatarColor(commenterName)} text-white shrink-0`}>
                                                    {getInitials(commenterName)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 text-xs text-[--text-muted]">
                                                        <span className="font-medium text-[--text-secondary]">{commenterName}</span>
                                                        <span>•</span>
                                                        <span>{formatDate(c.createdAt)}</span>
                                                    </div>
                                                    <p className="text-sm text-[--text-secondary] mt-1">{c.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Notice"
                size="lg"
            >
                <NoticeForm
                    initialData={notice}
                    onCancel={() => setShowEditModal(false)}
                    onSuccess={() => setShowEditModal(false)}
                />
            </Modal>
        </>
    );
}
