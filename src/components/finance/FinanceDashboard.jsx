import { useFinance } from '../../context/FinanceContext';
import { useState } from 'react';
import Modal from '../Modal';
import { useProjects } from '../../context/ProjectsContext';
import { useToast } from '../Toast';

export default function FinanceDashboard() {
    const { 
        revenues, 
        expenses, 
        budgets, 
        getTotalRevenue, 
        getTotalExpenses, 
        getNetProfit,
        addRevenue,
        addExpense
    } = useFinance();
    const { projects } = useProjects();
    const { addToast } = useToast();
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [revenueFormData, setRevenueFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        projectId: '',
        notes: ''
    });
    const [expenseFormData, setExpenseFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        projectId: '',
        notes: ''
    });

    const revenueCategories = [
        'Project Payment',
        'Consulting',
        'Product Sales',
        'Subscription',
        'License Fee',
        'Other'
    ];

    const expenseCategories = [
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

    const handleRevenueSubmit = async (e) => {
        e.preventDefault();
        try {
            const revenueData = {
                ...revenueFormData,
                amount: parseFloat(revenueFormData.amount),
                projectId: revenueFormData.projectId || null
            };
            await addRevenue(revenueData);
            addToast('Revenue added successfully!', 'success');
            setShowRevenueModal(false);
            setRevenueFormData({
                description: '',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                projectId: '',
                notes: ''
            });
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const expenseData = {
                ...expenseFormData,
                amount: parseFloat(expenseFormData.amount),
                projectId: expenseFormData.projectId || null
            };
            await addExpense(expenseData);
            addToast('Expense added successfully!', 'success');
            setShowExpenseModal(false);
            setExpenseFormData({
                description: '',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                projectId: '',
                notes: ''
            });
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    // Calculate current period totals (this month)
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const currentPeriod = {
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
    };

    const totalRevenue = getTotalRevenue(currentPeriod);
    const totalExpenses = getTotalExpenses(currentPeriod);
    const netProfit = getNetProfit(currentPeriod);

    // Get recent transactions (last 5)
    const recentTransactions = [
        ...revenues.map(r => ({ ...r, type: 'revenue' })),
        ...expenses.map(e => ({ ...e, type: 'expense' }))
    ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

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

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-end space-x-3">
                <button
                    onClick={() => setShowRevenueModal(true)}
                    className="btn btn-primary"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Revenue
                </button>
                <button
                    onClick={() => setShowExpenseModal(true)}
                    className="btn btn-secondary"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Expense
                </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Revenue Card */}
                <div className="glass-card-static">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[--text-muted]">Total Revenue</p>
                            <p className="text-2xl font-bold text-[--accent-green]">
                                {formatCurrency(totalRevenue)}
                            </p>
                            <p className="text-xs text-[--text-muted] mt-1">This month</p>
                        </div>
                        <div className="p-3 bg-[--accent-green]/10 rounded-lg">
                            <svg className="w-6 h-6 text-[--accent-green]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Total Expenses Card */}
                <div className="glass-card-static">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[--text-muted]">Total Expenses</p>
                            <p className="text-2xl font-bold text-[--accent-red]">
                                {formatCurrency(totalExpenses)}
                            </p>
                            <p className="text-xs text-[--text-muted] mt-1">This month</p>
                        </div>
                        <div className="p-3 bg-[--accent-red]/10 rounded-lg">
                            <svg className="w-6 h-6 text-[--accent-red]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Net Profit Card */}
                <div className="glass-card-static">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[--text-muted]">Net Profit</p>
                            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-[--accent-green]' : 'text-[--accent-red]'}`}>
                                {formatCurrency(netProfit)}
                            </p>
                            <p className="text-xs text-[--text-muted] mt-1">This month</p>
                        </div>
                        <div className={`p-3 rounded-lg ${netProfit >= 0 ? 'bg-[--accent-green]/10' : 'bg-[--accent-red]/10'}`}>
                            <svg className={`w-6 h-6 ${netProfit >= 0 ? 'text-[--accent-green]' : 'text-[--accent-red]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-card-static">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[--text-primary]">Recent Transactions</h3>
                    <span className="text-sm text-[--text-muted]">Last 5 entries</span>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-[--text-muted] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-[--text-muted]">No transactions yet</p>
                        <p className="text-sm text-[--text-muted] mt-1">
                            Start by adding revenue or expense entries
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => (
                            <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-3 bg-[--bg-secondary] rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${
                                        transaction.type === 'revenue' 
                                            ? 'bg-[--accent-green]/10 text-[--accent-green]' 
                                            : 'bg-[--accent-red]/10 text-[--accent-red]'
                                    }`}>
                                        {transaction.type === 'revenue' ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[--text-primary]">{transaction.description}</p>
                                        <p className="text-sm text-[--text-muted]">
                                            {transaction.category} • {formatDate(transaction.date)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${
                                        transaction.type === 'revenue' 
                                            ? 'text-[--accent-green]' 
                                            : 'text-[--accent-red]'
                                    }`}>
                                        {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Budget Overview */}
            {budgets.length > 0 && (
                <div className="glass-card-static">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[--text-primary]">Budget Overview</h3>
                        <span className="text-sm text-[--text-muted]">Active budgets</span>
                    </div>

                    <div className="space-y-4">
                        {budgets.filter(budget => budget.status === 'active').slice(0, 3).map((budget) => {
                            const utilization = (budget.spentAmount / budget.allocatedAmount) * 100;
                            const isOverBudget = utilization > 100;
                            
                            return (
                                <div key={budget.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-[--text-primary]">{budget.name}</span>
                                        <span className="text-sm text-[--text-muted]">
                                            {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.allocatedAmount)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-[--bg-tertiary] rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${
                                                isOverBudget ? 'bg-[--accent-red]' : 'bg-[--accent-green]'
                                            }`}
                                            style={{ width: `${Math.min(utilization, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={`font-medium ${isOverBudget ? 'text-[--accent-red]' : 'text-[--text-muted]'}`}>
                                            {utilization.toFixed(1)}% used
                                        </span>
                                        {isOverBudget && (
                                            <span className="text-[--accent-red] font-medium">Over budget!</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Add Revenue Modal */}
            <Modal
                isOpen={showRevenueModal}
                onClose={() => setShowRevenueModal(false)}
                title="Add Revenue"
            >
                <form onSubmit={handleRevenueSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[--text-primary] mb-2">
                            Description *
                        </label>
                        <input
                            type="text"
                            value={revenueFormData.description}
                            onChange={(e) => setRevenueFormData({ ...revenueFormData, description: e.target.value })}
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
                                value={revenueFormData.amount}
                                onChange={(e) => setRevenueFormData({ ...revenueFormData, amount: e.target.value })}
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
                                value={revenueFormData.date}
                                onChange={(e) => setRevenueFormData({ ...revenueFormData, date: e.target.value })}
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
                                value={revenueFormData.category}
                                onChange={(e) => setRevenueFormData({ ...revenueFormData, category: e.target.value })}
                                className="select-dark w-full"
                                required
                            >
                                <option value="">Select category</option>
                                {revenueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                Project (Optional)
                            </label>
                            <select
                                value={revenueFormData.projectId}
                                onChange={(e) => setRevenueFormData({ ...revenueFormData, projectId: e.target.value })}
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
                            value={revenueFormData.notes}
                            onChange={(e) => setRevenueFormData({ ...revenueFormData, notes: e.target.value })}
                            className="textarea-dark w-full"
                            rows={3}
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowRevenueModal(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Add Revenue
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Add Expense Modal */}
            <Modal
                isOpen={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                title="Add Expense"
            >
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[--text-primary] mb-2">
                            Description *
                        </label>
                        <input
                            type="text"
                            value={expenseFormData.description}
                            onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
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
                                step="0.01"
                                min="0"
                                value={expenseFormData.amount}
                                onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
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
                                value={expenseFormData.date}
                                onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
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
                                value={expenseFormData.category}
                                onChange={(e) => setExpenseFormData({ ...expenseFormData, category: e.target.value })}
                                className="select-dark w-full"
                                required
                            >
                                <option value="">Select category</option>
                                {expenseCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[--text-primary] mb-2">
                                Project (Optional)
                            </label>
                            <select
                                value={expenseFormData.projectId}
                                onChange={(e) => setExpenseFormData({ ...expenseFormData, projectId: e.target.value })}
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
                            value={expenseFormData.notes}
                            onChange={(e) => setExpenseFormData({ ...expenseFormData, notes: e.target.value })}
                            className="textarea-dark w-full"
                            rows={3}
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowExpenseModal(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Add Expense
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}