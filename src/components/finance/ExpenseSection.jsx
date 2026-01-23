import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useProjects } from '../../context/ProjectsContext';
import { useToast } from '../Toast';
import Modal from '../Modal';

export default function ExpenseSection() {
    const { expenses, addExpense, editExpense, removeExpense, loading } = useFinance();
    const { projects } = useProjects();
    const { addToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        projectId: '',
        notes: ''
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
            const expenseData = {
                ...formData,
                amount: parseInt(formData.amount, 10),
                projectId: formData.projectId || null
            };

            if (editingExpense) {
                await editExpense(editingExpense.id, expenseData);
                addToast('Expense updated successfully!', 'success');
            } else {
                await addExpense(expenseData);
                addToast('Expense added successfully!', 'success');
            }

            handleCloseModal();
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            description: expense.description,
            amount: expense.amount.toString(),
            category: expense.category,
            date: expense.date,
            projectId: expense.projectId || '',
            notes: expense.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense entry?')) {
            try {
                await removeExpense(expenseId);
                addToast('Expense deleted successfully!', 'success');
            } catch (error) {
                addToast(error.message, 'error');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingExpense(null);
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

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Group expenses by category for summary
    const expensesByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[--text-primary]">Expense Management</h2>
                    <p className="text-[--text-muted] mt-1">Track and categorize business expenses</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Expense
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Expenses */}
                <div className="glass-card-static">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[--text-muted]">Total Expenses</p>
                            <p className="text-3xl font-bold text-[--accent-red]">
                                {formatCurrency(totalExpenses)}
                            </p>
                            <p className="text-sm text-[--text-muted] mt-1">
                                {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
                            </p>
                        </div>
                        <div className="p-4 bg-[--accent-red]/10 rounded-lg">
                            <svg className="w-8 h-8 text-[--accent-red]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Top Category */}
                <div className="glass-card-static">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[--text-muted]">Top Category</p>
                            {Object.keys(expensesByCategory).length > 0 ? (
                                <>
                                    <p className="text-xl font-bold text-[--text-primary]">
                                        {Object.entries(expensesByCategory).sort(([,a], [,b]) => b - a)[0][0]}
                                    </p>
                                    <p className="text-sm text-[--accent-red] mt-1">
                                        {formatCurrency(Object.entries(expensesByCategory).sort(([,a], [,b]) => b - a)[0][1])}
                                    </p>
                                </>
                            ) : (
                                <p className="text-xl font-bold text-[--text-muted]">No expenses yet</p>
                            )}
                        </div>
                        <div className="p-4 bg-[--accent-cyan]/10 rounded-lg">
                            <svg className="w-8 h-8 text-[--accent-cyan]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expense List */}
            <div className="glass-card-static">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[--text-primary]">Expense Entries</h3>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="spinner mx-auto mb-3"></div>
                        <p className="text-[--text-muted]">Loading expense entries...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-[--text-muted] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-[--text-primary] mb-2">No Expense Entries</h3>
                        <p className="text-[--text-muted] mb-4">
                            Start tracking your expenses by adding your first entry.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            Add First Expense Entry
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {expenses.map((expense) => {
                            const project = projects.find(p => p.id === expense.projectId);
                            return (
                                <div key={expense.id} className="flex items-center justify-between p-4 bg-[--bg-secondary] rounded-lg hover:bg-[--bg-tertiary] transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-[--accent-red]/10 rounded-lg">
                                            <svg className="w-5 h-5 text-[--accent-red]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[--text-primary]">{expense.description}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-[--text-muted] mt-1">
                                                <span>{expense.category}</span>
                                                <span>•</span>
                                                <span>{formatDate(expense.date)}</span>
                                                {project && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{project.name}</span>
                                                    </>
                                                )}
                                            </div>
                                            {expense.notes && (
                                                <p className="text-sm text-[--text-muted] mt-1">{expense.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-[--accent-red]">
                                                -{formatCurrency(expense.amount)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="p-2 text-[--text-muted] hover:text-[--accent-cyan] hover:bg-[--accent-cyan]/10 rounded-lg transition-colors"
                                                title="Edit expense"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-2 text-[--text-muted] hover:text-[--accent-red] hover:bg-[--accent-red]/10 rounded-lg transition-colors"
                                                title="Delete expense"
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

            {/* Add/Edit Expense Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingExpense ? 'Edit Expense' : 'Add Expense'}
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
                            placeholder="Enter expense description"
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
                                min="0"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="input-dark w-full"
                                placeholder="0"
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
                            {editingExpense ? 'Update Expense' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}