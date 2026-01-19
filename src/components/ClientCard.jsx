import { useState } from 'react';
import { useClients } from '../context/ClientsContext';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from './ConfirmDialog';
import { useToast } from './Toast';
import Modal from './Modal';
import ClientForm from './ClientForm';

const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
    });
};

const getEngagementBadgeColor = (type) => {
    switch (type) {
        case 'Retainer':
            return 'badge-cyan';
        case 'Project-Based':
            return 'badge-gray';
        case 'Campaign':
            return 'badge-yellow';
        default:
            return 'badge-gray';
    }
};

const getIndustryIcon = (industry) => {
    switch (industry) {
        case 'Tech':
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
        case 'Fashion':
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
                </svg>
            );
        case 'Real Estate':
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            );
        case 'Personal Brand':
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            );
        default:
            return (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            );
    }
};

export default function ClientCard({ client }) {
    const { editClient, removeClient } = useClients();
    const { isAdmin, user } = useAuth();
    const confirm = useConfirm();
    const toast = useToast();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const isOngoing = !client.endDate;
    const canEdit = isAdmin || client.createdBy === user?.uid;

    const handleEdit = async (clientData) => {
        try {
            await editClient(client.id, clientData);
            setShowEditModal(false);
            toast.success('Client updated successfully');
        } catch (error) {
            toast.error('Failed to update client');
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete Client',
            message: `Are you sure you want to delete "${client.name}"? This action cannot be undone.`,
            confirmText: 'Delete',
            confirmVariant: 'danger'
        });

        if (confirmed) {
            try {
                await removeClient(client.id);
                toast.success('Client deleted successfully');
            } catch (error) {
                toast.error('Failed to delete client');
            }
        }
    };

    return (
        <>
            <div className="glass-card p-6 hover:transform hover:scale-[1.02] transition-all duration-300 group relative">
                {/* Admin Menu */}
                {canEdit && (
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 rounded-lg hover:bg-[--bg-tertiary] text-[--text-muted] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-8 bg-[--bg-tertiary] border border-[--glass-border] rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                <button
                                    onClick={() => {
                                        setShowEditModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-[--text-secondary] hover:bg-[--bg-card] hover:text-[--text-primary] transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete();
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-[--accent-red] hover:bg-[--bg-card] transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4 pr-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-[--text-muted]">
                                {getIndustryIcon(client.industry)}
                            </div>
                            <h3 className="text-lg font-semibold text-[--text-primary] group-hover:text-[--accent-cyan] transition-colors">
                                {client.name}
                            </h3>
                        </div>
                        <p className="text-sm text-[--text-muted]">
                            {client.industry}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {isOngoing && (
                            <span className="badge badge-cyan text-xs animate-pulse">
                                <div className="w-2 h-2 bg-current rounded-full mr-1"></div>
                                Ongoing
                            </span>
                        )}
                    </div>
                </div>

                {/* Engagement Details */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`badge ${getEngagementBadgeColor(client.engagementType)} text-xs`}>
                            {client.engagementType}
                        </span>
                    </div>
                    <div className="text-sm text-[--text-secondary] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[--text-muted]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(client.startDate)} - {formatDate(client.endDate)}
                    </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                        {client.services?.map((service, index) => (
                            <span 
                                key={index}
                                className="text-xs px-2 py-1 bg-[--bg-tertiary] text-[--text-muted] rounded-md hover:bg-[--bg-card] transition-colors"
                            >
                                {service}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Impact */}
                <div className="border-t border-[--glass-border] pt-4">
                    <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[--accent-cyan] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <p className="text-sm text-[--text-secondary] italic">
                            {client.impact}
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Client"
            >
                <ClientForm
                    initialData={client}
                    onSubmit={handleEdit}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>
        </>
    );
}