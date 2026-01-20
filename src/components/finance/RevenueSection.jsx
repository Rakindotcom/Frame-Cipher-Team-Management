import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useProjects } from '../../context/ProjectsContext';
import { useToast } from '../Toast';
import Modal from '../Modal';

export default function RevenueSection() {
    const { revenues, addRevenue, editRevenue, removeRevenue, loading } = useFinance();
    const { projects } = useProjects();
    const { addToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        projectId: '',
        notes: ''
    });

    const categories = [
        'Project Payment',
        'Consulting',
        'Product Sales',
        'Subscription',
        'License Fee',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const revenueData = {
                ...formData,
                amount: parseFloat(formData.amount),
                projectId: formData.projectId || null
            };

            if (editingRevenue) {
                await editRevenue(editingRevenue.id, revenueData);
                addToast('Revenue updated successfully!', 'success');
            } else {
                await addRevenue(revenueData);
                addToast('Revenue added successfully!', 'success');
            }

            handleCloseModal();
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const handleEdit = (revenue) => {
        setEditingRevenue(revenue);
        setFormData({
            description: revenue.description,
            amount: revenue.amount.toString(),
            category: revenue.category,
            date: revenue.date,
            projectId: revenue.projectId || '',
            notes: revenue.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (revenueId) => {
        if (window.confirm('Are you sure you want to delete this revenue entry?')) {
            try {
                await removeRevenue(revenueId);
                addToast('Revenue deleted successfully!', 'success');
            } catch (error) {
                addToast(error.message, 'error');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRevenue(null);
        setFormData({
            description: '',
            amount: '',
            category: '',
            date: new Date().toISOString().split('T')[0],
            projectId: '',
            notes: ''
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[--text-primary]">Revenue Management</h2>
                    <p className="text-[--text-muted] mt-1">Track and manage revenue entries</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Revenue
                </button>
            </div>

            {/* Summary Card */}
            <div className="glass-card-static">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-[--text-muted]">Total Revenue</p>
                        <p className="text-3xl font-bold text-[--accent-green]">
                            {formatCurrency(totalRevenue)}
                        </p>
                        <p className="text-sm text-[--text-muted] mt-1">
                            {revenues.length} {revenues.length === 1 ? 'entry' : 'entries'}
                        </p>
                    </div>
                    <div className="p-4 bg-[--accent-green]/10 rounded-lg">
                        <svg className="w-8 h-8 text-[--accent-green]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Revenue List */}
            <div className="glass-card-static">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[--text-primary]">Revenue Entries</h3>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="spinner mx-auto mb-3"></div>
                        <p className="text-[--text-muted]">Loading revenue entries...</p>
                    </div>
                ) : revenues.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-[--text-muted] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <h3 className="text-lg font-semibold text-[--text-primary] mb-2">No Revenue Entries</h3>
                        <p className="text-[--text-muted] mb-4">
                            Start tracking your revenue by adding your first entry.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            Add First Revenue Entry
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {revenues.map((revenue) => {
                            const project = projects.find(p => p.id === revenue.projectId);
                            return (
                                <div key={revenue.id} className="flex items-center justify-between p-4 bg-[--bg-secondary] rounded-lg hover:bg-[--bg-tertiary] transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-[--accent-green]/10 rounded-lg">
                                            <svg className="w-5 h-5 text-[--accent-green]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[--text-primary]">{revenue.description}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-[--text-muted] mt-1">
                                                <span>{revenue.category}</span>
                                                <span>•</span>
                                                <span>{formatDate(revenue.date)}</span>
                                                {project && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{project.name}</span>
                                                    </>
                                                )}
                                            </div>
                                            {revenue.notes && (
                                                <p className="text-sm text-[--text-muted] mt-1">{revenue.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-[--accent-green]">
                                                {formatCurrency(revenue.amount)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(revenue)}
                                                className="p-2 text-[--text-muted] hover:text-[--accent-cyan] hover:bg-[--accent-cyan]/10 rounded-lg transition-colors"
                                                title="Edit revenue"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(revenue.id)}
                                                className="p-2 text-[--text-muted] hover:text-[--accent-red] hover:bg-[--accent-red]/10 rounded-lg transition-colors"
                                                title="Delete revenue"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add/Edit Revenue Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingRevenue ? 'Edit Revenue' : 'Add Revenue'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[--text-primary] mb-2">
                            Description *
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-dark w-full"
                            placeholder="Enter revenue description"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                Amount *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="input-dark w-full"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="input-dark w-full"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="select-dark w-full"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                Project (Optional)
                            </label>
                            <select
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                className="select-dark w-full"
                            >
                                <option value="">No project</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[--text-primary] mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="textarea-dark w-full"
                            rows={3}
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {editingRevenue ? 'Update Revenue' : 'Add Revenue'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}