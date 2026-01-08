import { useState } from 'react';
import { useTasks } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, getInitials, getAvatarColor } from '../utils/helpers';
import { useUsers } from '../context/UsersContext';

export default function CommentSection({ taskId, comments = [] }) {
    const { addTaskComment } = useTasks();
    const { getUserName } = useUsers();
    const { userProfile } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || loading) return;

        setLoading(true);
        try {
            await addTaskComment(taskId, newComment.trim());
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-[--text-primary] flex items-center space-x-2">
                <svg className="w-5 h-5 text-[--accent-cyan]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>Comments</span>
                <span className="badge badge-cyan">{comments.length}</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex space-x-3">
                    <div className={`avatar avatar-md bg-linear-to-br ${getAvatarColor(userProfile?.name)} text-white shrink-0`}>
                        {getInitials(userProfile?.name)}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={3}
                            className="textarea-dark"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!newComment.trim() || loading}
                        className="btn-primary inline-flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="spinner spinner-sm"></div>
                                <span>Posting...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <span>Post</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Divider */}
            <div className="divider"></div>

            {/* Comments List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="text-center py-6">
                        <svg className="w-12 h-12 mx-auto text-[--text-muted] opacity-40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm text-[--text-muted]">No comments yet</p>
                        <p className="text-xs text-[--text-muted] mt-1">Be the first to comment</p>
                    </div>
                ) : (
                    [...comments].reverse().map((comment) => {
                        const commenterName = getUserName(comment.userId);
                        return (
                            <div key={comment.id} className="flex space-x-3 animate-fade-in">
                                <div className={`avatar avatar-md bg-linear-to-br ${getAvatarColor(commenterName)} text-white shrink-0`}>
                                    {getInitials(commenterName)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-sm font-medium text-[--text-primary]">
                                            {commenterName}
                                        </span>
                                        <span className="text-xs text-[--text-muted]">
                                            {formatDateTime(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[--text-secondary] whitespace-pre-wrap">{comment.message}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
