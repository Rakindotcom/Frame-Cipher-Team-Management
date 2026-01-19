import { useState } from 'react';
import Layout from '../components/Layout';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import Modal from '../components/Modal';
import { useClients } from '../context/ClientsContext';
import { useToast } from '../components/Toast';

export default function ClientsPage() {
    const { clients, loading, addClient } = useClients();
    const toast = useToast();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    const filterOptions = ['All', 'Ongoing', 'Completed'];
    
    const filteredClients = clients.filter(client => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Ongoing') return !client.endDate;
        if (activeFilter === 'Completed') return client.endDate;
        return true;
    });

    const ongoingCount = clients.filter(c => !c.endDate).length;
    const completedCount = clients.filter(c => c.endDate).length;

    const handleCreateClient = async (clientData) => {
        try {
            await addClient(clientData);
            setShowCreateModal(false);
            toast.success('Client added successfully');
        } catch (error) {
            toast.error('Failed to add client');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gradient">Clients & Collaborations</h1>
                        <p className="text-sm text-[--text-muted] mt-1">
                            Building lasting partnerships through exceptional delivery
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary inline-flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Client</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="spinner spinner-lg mx-auto mb-4"></div>
                            <p className="text-[--text-muted]">Loading clients...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Filter Tabs */}
                        {clients.length > 0 && (
                            <div className="flex justify-center">
                                <div className="view-toggle">
                                    {filterOptions.map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`view-toggle-btn ${
                                                activeFilter === filter ? 'view-toggle-btn-active' : ''
                                            }`}
                                        >
                                            {filter}
                                            {filter !== 'All' && (
                                                <span className="ml-1 text-xs opacity-70">
                                                    ({filter === 'Ongoing' ? ongoingCount : completedCount})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Bar */}
                        {clients.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="stat-card text-center">
                                    <div className="stat-value text-2xl">
                                        {clients.length}
                                    </div>
                                    <div className="stat-label">
                                        Total Clients
                                    </div>
                                </div>
                                <div className="stat-card text-center">
                                    <div className="stat-value text-2xl text-[--accent-cyan]">
                                        {ongoingCount}
                                    </div>
                                    <div className="stat-label">
                                        Active Projects
                                    </div>
                                </div>
                                <div className="stat-card text-center">
                                    <div className="stat-value text-2xl">
                                        {clients.length > 0 ? Math.round(completedCount / clients.length * 100) : 0}%
                                    </div>
                                    <div className="stat-label">
                                        Success Rate
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Clients Grid or Empty State */}
                        {filteredClients.length === 0 && clients.length > 0 ? (
                            <div className="glass-card-static">
                                <div className="empty-state py-12">
                                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="empty-state-title">No clients found</p>
                                    <p className="empty-state-description">
                                        No clients match the selected filter criteria.
                                    </p>
                                </div>
                            </div>
                        ) : clients.length === 0 ? (
                            <div className="glass-card-static">
                                <div className="empty-state py-12">
                                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="empty-state-title">No clients yet</p>
                                    <p className="empty-state-description">
                                        Start building your client portfolio by adding your first collaboration
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredClients.map((client, index) => (
                                        <div
                                            key={client.id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <ClientCard client={client} />
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Note */}
                                <div className="text-center pt-8 border-t border-[--glass-border]">
                                    <p className="text-sm text-[--text-muted]">
                                        Building lasting partnerships through exceptional delivery and measurable results.
                                    </p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Add New Client"
            >
                <ClientForm
                    onSubmit={handleCreateClient}
                    onCancel={() => setShowCreateModal(false)}
                />
            </Modal>
        </Layout>
    );
}