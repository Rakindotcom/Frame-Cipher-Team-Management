import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useProjects } from '../../context/ProjectsContext';
import { useToast } from '../Toast';
import Modal from '../Modal';

export default function BudgetSection() {
    const { budgets, addBudget, editBudget, removeBudget, loading } = useFinance();
    const { projects } = useProjects();
    const { addToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        allocatedAmount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        projectId: '',
        description: ''
    });

    const categories = [
        'Office Supplies',
        'Software & Tools',
        'Marketing',
        'Travel',
        'Equipment',
        'Utilities',
        'Professional Services',
        'Training',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const budgetData = {
                ...formData,
                allocatedAmount: parseFloat(formData.allocatedAmount),
                projectId: formData.projectId || null
            };

            if (editingBudget) {
                await editBudget(editingBudget.id, budgetData);
                addToast('Budget updated successfully!', 'success');
            } else {
                await addBudget(budgetData);
                addToast('Budget created successfully!', 'success');
            }

            handleCloseModal();
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setFormData({
            name: budget.name,
            category: budget.category,
            allocatedAmount: budget.allocatedAmount.toString(),
            startDate: budget.startDate,
            endDate: budget.endDate,
            projectId: budget.projectId || '',
            description: budget.description || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (budgetId) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await removeBudget(budgetId);
                addToast('Budget deleted successfully!', 'success');
            } catch (error) {
                addToast(error.message, 'error');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBudget(null);
        setFormData({
            name: '',
            category: '',
            allocatedAmount: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            projectId: '',
            description: ''
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-[--accent-green] bg-[--accent-green]/10';
            case 'exceeded':
                return 'text-[--accent-red] bg-[--accent-red]/10';
            case 'completed':
                return 'text-[--text-muted] bg-[--text-muted]/10';
            default:
                return 'text-[--text-muted] bg-[--text-muted]/10';
        }
    };

    const getUtilizationColor = (utilization) => {
        if (utilization > 100) return 'bg-[--accent-red]';
        if (utilization > 80) return 'bg-[--accent-yellow]';
        return 'bg-[--accent-green]';
    };

    const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spentAmount || 0), 0);
    const activeBudgets = budgets.filter(budget => budget.status === 'active');
    const exceededBudgets = budgets.filter(budget => budget.status === 'exceeded');

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[--text-primary]">Budget Management</h2>
                    <p className="text-[--text-muted] mt-1">Plan and track budget allocations</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Budget
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Allocated */}
                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Total Allocated</p>
                        <p className="text-2xl font-bold text-[--accent-cyan]">
                            {formatCurrency(totalAllocated)}
                        </p>
                    </div>
                </div>

                {/* Total Spent */}
                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Total Spent</p>
                        <p className="text-2xl font-bold text-[--accent-red]">
                            {formatCurrency(totalSpent)}
                        </p>
                    </div>
                </div>

                {/* Active Budgets */}
                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Active Budgets</p>
                        <p className="text-2xl font-bold text-[--accent-green]">
                            {activeBudgets.length}
                        </p>
                    </div>
                </div>

                {/* Exceeded Budgets */}
                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Over Budget</p>
                        <p className="text-2xl font-bold text-[--accent-red]">
                            {exceededBudgets.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Budget List */}
            <div className="glass-card-static">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[--text-primary]">Budget Overview</h3>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="spinner mx-auto mb-3"></div>
                        <p className="text-[--text-muted]">Loading budgets...</p>
                    </div>
                ) : budgets.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-[--text-muted] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-[--text-primary] mb-2">No Budgets Created</h3>
                        <p className="text-[--text-muted] mb-4">
                            Start planning your finances by creating your first budget.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            Create First Budget
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const project = projects.find(p => p.id === budget.projectId);
                            const utilization = (budget.spentAmount / budget.allocatedAmount) * 100;
                            const isOverBudget = utilization > 100;
                            const remaining = budget.allocatedAmount - budget.spentAmount;
                            
                            return (
                                <div key={budget.id} className="p-6 bg-[--bg-secondary] rounded-lg hover:bg-[--bg-tertiary] transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="text-lg font-semibold text-[--text-primary]">{budget.name}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                                                    {budget.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-[--text-muted]">
                                                <span>{budget.category}</span>
                                                <span>•</span>
                                                <span>{formatDate(budget.startDate)} - {formatDate(budget.endDate)}</span>
                                                {project && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{project.name}</span>
                                                    </>
                                                )}
                                            </div>
                                            {budget.description && (
                                                <p className="text-sm text-[--text-muted] mt-2">{budget.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(budget)}
                                                className="p-2 text-[--text-muted] hover:text-[--accent-cyan] hover:bg-[--accent-cyan]/10 rounded-lg transition-colors"
                                                title="Edit budget"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(budget.id)}
                                                className="p-2 text-[--text-muted] hover:text-[--accent-red] hover:bg-[--accent-red]/10 rounded-lg transition-colors"
                                                title="Delete budget"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Budget Progress */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[--text-muted]">Budget Utilization</span>
                                            <span className={`font-medium ${isOverBudget ? 'text-[--accent-red]' : 'text-[--text-primary]'}`}>
                                                {utilization.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-[--bg-tertiary] rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all ${getUtilizationColor(utilization)}`}
                                                style={{ width: `${Math.min(utilization, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div>
                                                <span className="text-[--text-muted]">Spent: </span>
                                                <span className="font-medium text-[--accent-red]">
                                                    {formatCurrency(budget.spentAmount)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[--text-muted]">Allocated: </span>
                                                <span className="font-medium text-[--text-primary]">
                                                    {formatCurrency(budget.allocatedAmount)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-sm text-[--text-muted]">Remaining: </span>
                                            <span className={`font-medium ${remaining >= 0 ? 'text-[--accent-green]' : 'text-[--accent-red]'}`}>
                                                {formatCurrency(Math.abs(remaining))} {remaining < 0 ? 'over budget' : 'available'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add/Edit Budget Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingBudget ? 'Edit Budget' : 'Create Budget'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[--text-primary] mb-2">
                            Budget Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-dark w-full"
                            placeholder="Enter budget name"
                            required
                        />
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
                                Allocated Amount *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.allocatedAmount}
                                onChange={(e) => setFormData({ ...formData, allocatedAmount: e.target.value })}
                                className="input-dark w-full"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="input-dark w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                End Date *
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="input-dark w-full"
                                required
                            />
                        </div>
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

                    <div>
                        <label className="block text-sm font-medium text-[--text-primary] mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="textarea-dark w-full"
                            rows={3}
                            placeholder="Budget description..."
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
                            {editingBudget ? 'Update Budget' : 'Create Budget'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}