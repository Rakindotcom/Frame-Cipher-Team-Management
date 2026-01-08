import { useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import NoticeForm from '../components/NoticeForm';
import NoticeCard from '../components/NoticeCard';
import { useNotices } from '../context/NoticesContext';
import { useAuth } from '../context/AuthContext';

export default function NoticesPage() {
    const { notices, loading } = useNotices();
    const { isAdmin } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gradient">Notices & Announcements</h1>
                        <p className="text-sm text-[--text-muted] mt-1">
                            Stay updated with important announcements
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>New Notice</span>
                        </button>
                    )}
                </div>

                {/* Notices List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="spinner spinner-lg mx-auto mb-4"></div>
                            <p className="text-[--text-muted]">Loading notices...</p>
                        </div>
                    </div>
                ) : notices.length === 0 ? (
                    <div className="glass-card-static">
                        <div className="empty-state py-12">
                            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            <p className="empty-state-title">No notices yet</p>
                            <p className="empty-state-description">
                                {isAdmin ? 'Create your first notice to keep everyone informed' : 'Check back later for announcements'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notices.map((notice, index) => (
                            <div
                                key={notice.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <NoticeCard notice={notice} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Notice Modal */}
            {isAdmin && (
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="New Notice"
                    size="lg"
                >
                    <NoticeForm
                        onCancel={() => setShowCreateModal(false)}
                        onSuccess={() => setShowCreateModal(false)}
                    />
                </Modal>
            )}
        </Layout>
    );
}
