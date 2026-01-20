import { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useProjects } from '../../context/ProjectsContext';

export default function ReportsSection() {
    const { revenues, expenses, budgets, getTotalRevenue, getTotalExpenses, getNetProfit } = useFinance();
    const { projects } = useProjects();
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
    const [selectedProject, setSelectedProject] = useState('');

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

    // Calculate date ranges
    const getDateRange = (period) => {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'thisQuarter':
                const quarterStart = Math.floor(now.getMonth() / 3) * 3;
                startDate = new Date(now.getFullYear(), quarterStart, 1);
                endDate = new Date(now.getFullYear(), quarterStart + 3, 0);
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'lastYear':
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };
    };

    const dateRange = getDateRange(selectedPeriod);

    // Filter data by period and project
    const filteredRevenues = useMemo(() => {
        let filtered = revenues.filter(revenue => {
            const revenueDate = new Date(revenue.date);
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);
            return revenueDate >= start && revenueDate <= end;
        });

        if (selectedProject) {
            filtered = filtered.filter(revenue => revenue.projectId === selectedProject);
        }

        return filtered;
    }, [revenues, dateRange, selectedProject]);

    const filteredExpenses = useMemo(() => {
        let filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);
            return expenseDate >= start && expenseDate <= end;
        });

        if (selectedProject) {
            filtered = filtered.filter(expense => expense.projectId === selectedProject);
        }

        return filtered;
    }, [expenses, dateRange, selectedProject]);

    // Calculate metrics
    const totalRevenue = filteredRevenues.reduce((sum, revenue) => sum + revenue.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Revenue by category
    const revenueByCategory = filteredRevenues.reduce((acc, revenue) => {
        acc[revenue.category] = (acc[revenue.category] || 0) + revenue.amount;
        return acc;
    }, {});

    // Expenses by category
    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    // Monthly trend (last 6 months)
    const monthlyTrend = useMemo(() => {
        const months = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const monthRevenues = revenues.filter(revenue => {
                const revenueDate = new Date(revenue.date);
                return revenueDate >= monthStart && revenueDate <= monthEnd;
            });
            
            const monthExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            });
            
            const monthRevenue = monthRevenues.reduce((sum, revenue) => sum + revenue.amount, 0);
            const monthExpense = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
            months.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                revenue: monthRevenue,
                expenses: monthExpense,
                profit: monthRevenue - monthExpense
            });
        }
        
        return months;
    }, [revenues, expenses]);

    const periods = [
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' },
        { value: 'thisQuarter', label: 'This Quarter' },
        { value: 'thisYear', label: 'This Year' },
        { value: 'lastYear', label: 'Last Year' }
    ];

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[--text-primary]">Financial Reports</h2>
                    <p className="text-[--text-muted] mt-1">Analyze financial performance and trends</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="select-dark"
                    >
                        {periods.map(period => (
                            <option key={period.value} value={period.value}>{period.label}</option>
                        ))}
                    </select>
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="select-dark"
                    >
                        <option value="">All Projects</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Total Revenue</p>
                        <p className="text-2xl font-bold text-[--accent-green]">
                            {formatCurrency(totalRevenue)}
                        </p>
                        <p className="text-xs text-[--text-muted] mt-1">
                            {filteredRevenues.length} transactions
                        </p>
                    </div>
                </div>

                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Total Expenses</p>
                        <p className="text-2xl font-bold text-[--accent-red]">
                            {formatCurrency(totalExpenses)}
                        </p>
                        <p className="text-xs text-[--text-muted] mt-1">
                            {filteredExpenses.length} transactions
                        </p>
                    </div>
                </div>

                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Net Profit</p>
                        <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-[--accent-green]' : 'text-[--accent-red]'}`}>
                            {formatCurrency(netProfit)}
                        </p>
                        <p className="text-xs text-[--text-muted] mt-1">
                            {netProfit >= 0 ? 'Profit' : 'Loss'}
                        </p>
                    </div>
                </div>

                <div className="glass-card-static">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[--text-muted]">Profit Margin</p>
                        <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-[--accent-green]' : 'text-[--accent-red]'}`}>
                            {profitMargin.toFixed(1)}%
                        </p>
                        <p className="text-xs text-[--text-muted] mt-1">
                            Margin
                        </p>
                    </div>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="glass-card-static">
                <h3 className="text-lg font-semibold text-[--text-primary] mb-6">6-Month Trend</h3>
                <div className="space-y-4">
                    {monthlyTrend.map((month, index) => {
                        const maxValue = Math.max(...monthlyTrend.map(m => Math.max(m.revenue, m.expenses)));
                        const revenueWidth = maxValue > 0 ? (month.revenue / maxValue) * 100 : 0;
                        const expenseWidth = maxValue > 0 ? (month.expenses / maxValue) * 100 : 0;
                        
                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-[--text-primary]">{month.month}</span>
                                    <span className={`font-medium ${month.profit >= 0 ? 'text-[--accent-green]' : 'text-[--accent-red]'}`}>
                                        {formatCurrency(month.profit)}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-[--accent-green] w-16">Revenue</span>
                                        <div className="flex-1 bg-[--bg-tertiary] rounded-full h-2">
                                            <div
                                                className="bg-[--accent-green] h-2 rounded-full"
                                                style={{ width: `${revenueWidth}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-[--text-muted] w-20 text-right">
                                            {formatCurrency(month.revenue)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-[--accent-red] w-16">Expenses</span>
                                        <div className="flex-1 bg-[--bg-tertiary] rounded-full h-2">
                                            <div
                                                className="bg-[--accent-red] h-2 rounded-full"
                                                style={{ width: `${expenseWidth}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-[--text-muted] w-20 text-right">
                                            {formatCurrency(month.expenses)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Category */}
                <div className="glass-card-static">
                    <h3 className="text-lg font-semibold text-[--text-primary] mb-6">Revenue by Category</h3>
                    {Object.keys(revenueByCategory).length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[--text-muted]">No revenue data for selected period</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(revenueByCategory)
                                .sort(([,a], [,b]) => b - a)
                                .map(([category, amount]) => {
                                    const percentage = (amount / totalRevenue) * 100;
                                    return (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-[--text-primary]">{category}</span>
                                                <span className="text-sm text-[--accent-green]">
                                                    {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-[--bg-tertiary] rounded-full h-2">
                                                <div
                                                    className="bg-[--accent-green] h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

                {/* Expenses by Category */}
                <div className="glass-card-static">
                    <h3 className="text-lg font-semibold text-[--text-primary] mb-6">Expenses by Category</h3>
                    {Object.keys(expensesByCategory).length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[--text-muted]">No expense data for selected period</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(expensesByCategory)
                                .sort(([,a], [,b]) => b - a)
                                .map(([category, amount]) => {
                                    const percentage = (amount / totalExpenses) * 100;
                                    return (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-[--text-primary]">{category}</span>
                                                <span className="text-sm text-[--accent-red]">
                                                    {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-[--bg-tertiary] rounded-full h-2">
                                                <div
                                                    className="bg-[--accent-red] h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* Budget Performance */}
            {budgets.length > 0 && (
                <div className="glass-card-static">
                    <h3 className="text-lg font-semibold text-[--text-primary] mb-6">Budget Performance</h3>
                    <div className="space-y-4">
                        {budgets.filter(budget => budget.status === 'active').map((budget) => {
                            const utilization = (budget.spentAmount / budget.allocatedAmount) * 100;
                            const isOverBudget = utilization > 100;
                            
                            return (
                                <div key={budget.id} className="flex items-center justify-between p-4 bg-[--bg-secondary] rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-[--text-primary]">{budget.name}</span>
                                            <span className={`text-sm font-medium ${isOverBudget ? 'text-[--accent-red]' : 'text-[--text-primary]'}`}>
                                                {utilization.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-[--bg-tertiary] rounded-full h-2 mb-2">
                                            <div
                                                className={`h-2 rounded-full ${isOverBudget ? 'bg-[--accent-red]' : 'bg-[--accent-green]'}`}
                                                style={{ width: `${Math.min(utilization, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-[--text-muted]">
                                            <span>{formatCurrency(budget.spentAmount)} spent</span>
                                            <span>{formatCurrency(budget.allocatedAmount)} allocated</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}