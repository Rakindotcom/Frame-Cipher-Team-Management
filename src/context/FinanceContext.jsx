import { useEffect, useState } from 'react';
import {
    subscribeToRevenues,
    subscribeToExpenses,
    subscribeToBudgets,
    createRevenue,
    createExpense,
    createBudget,
    updateRevenue,
    updateExpense,
    updateBudget,
    deleteRevenue,
    deleteExpense,
    deleteBudget,
    getProjectFinances
} from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { FinanceContext } from './contexts';

export function FinanceProvider({ children }) {
    const [revenues, setRevenues] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loadedUserId, setLoadedUserId] = useState(null);
    const [error, setError] = useState(null);
    const { user, isAdmin } = useAuth();
    const userId = user?.uid;

    useEffect(() => {
        if (!userId || !isAdmin) return;

        let unsubscribeRevenues, unsubscribeExpenses, unsubscribeBudgets;

        // Subscribe to revenues
        unsubscribeRevenues = subscribeToRevenues((revenuesList) => {
            setRevenues(revenuesList);
        });

        // Subscribe to expenses
        unsubscribeExpenses = subscribeToExpenses((expensesList) => {
            setExpenses(expensesList);
        });

        // Subscribe to budgets
        unsubscribeBudgets = subscribeToBudgets((budgetsList) => {
            setBudgets(budgetsList);
            setLoadedUserId(userId);
        });

        return () => {
            if (unsubscribeRevenues) unsubscribeRevenues();
            if (unsubscribeExpenses) unsubscribeExpenses();
            if (unsubscribeBudgets) unsubscribeBudgets();
        };
    }, [userId, isAdmin]);

    // Revenue operations
    const addRevenue = async (revenueData) => {
        try {
            setError(null);
            const id = await createRevenue({
                ...revenueData,
                createdBy: user.uid
            });
            return id;
        } catch (err) {
            console.error('Error creating revenue:', err);
            setError(err.message);
            throw err;
        }
    };

    const editRevenue = async (revenueId, updates) => {
        try {
            setError(null);
            await updateRevenue(revenueId, updates);
        } catch (err) {
            console.error('Error updating revenue:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeRevenue = async (revenueId) => {
        try {
            setError(null);
            await deleteRevenue(revenueId);
        } catch (err) {
            console.error('Error deleting revenue:', err);
            setError(err.message);
            throw err;
        }
    };

    // Expense operations
    const addExpense = async (expenseData) => {
        try {
            setError(null);
            const id = await createExpense({
                ...expenseData,
                createdBy: user.uid
            });
            return id;
        } catch (err) {
            console.error('Error creating expense:', err);
            setError(err.message);
            throw err;
        }
    };

    const editExpense = async (expenseId, updates) => {
        try {
            setError(null);
            await updateExpense(expenseId, updates);
        } catch (err) {
            console.error('Error updating expense:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeExpense = async (expenseId) => {
        try {
            setError(null);
            await deleteExpense(expenseId);
        } catch (err) {
            console.error('Error deleting expense:', err);
            setError(err.message);
            throw err;
        }
    };

    // Budget operations
    const addBudget = async (budgetData) => {
        try {
            setError(null);
            const id = await createBudget({
                ...budgetData,
                createdBy: user.uid
            });
            return id;
        } catch (err) {
            console.error('Error creating budget:', err);
            setError(err.message);
            throw err;
        }
    };

    const editBudget = async (budgetId, updates) => {
        try {
            setError(null);
            await updateBudget(budgetId, updates);
        } catch (err) {
            console.error('Error updating budget:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeBudget = async (budgetId) => {
        try {
            setError(null);
            await deleteBudget(budgetId);
        } catch (err) {
            console.error('Error deleting budget:', err);
            setError(err.message);
            throw err;
        }
    };

    // Financial calculations
    const getTotalRevenue = (dateRange) => {
        let filteredRevenues = revenues;
        
        if (dateRange) {
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            filteredRevenues = revenues.filter(revenue => {
                const revenueDate = new Date(revenue.date);
                return revenueDate >= startDate && revenueDate <= endDate;
            });
        }
        
        return filteredRevenues.reduce((total, revenue) => total + revenue.amount, 0);
    };

    const getTotalExpenses = (dateRange) => {
        let filteredExpenses = expenses;
        
        if (dateRange) {
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            filteredExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate && expenseDate <= endDate;
            });
        }
        
        return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const getNetProfit = (dateRange) => {
        return getTotalRevenue(dateRange) - getTotalExpenses(dateRange);
    };

    const getProjectFinancials = async (projectId) => {
        try {
            const { revenues: projectRevenues, expenses: projectExpenses } = await getProjectFinances(projectId);
            
            const totalRevenue = projectRevenues.reduce((total, revenue) => total + revenue.amount, 0);
            const totalExpenses = projectExpenses.reduce((total, expense) => total + expense.amount, 0);
            const netProfit = totalRevenue - totalExpenses;
            
            return {
                totalRevenue,
                totalExpenses,
                netProfit,
                revenues: projectRevenues,
                expenses: projectExpenses
            };
        } catch (err) {
            console.error('Error fetching project financials:', err);
            setError(err.message);
            throw err;
        }
    };

    // Update budget spent amounts based on expenses
    useEffect(() => {
        if (budgets.length > 0 && expenses.length > 0) {
            budgets.forEach(budget => {
                const budgetExpenses = expenses.filter(expense => {
                    // Match by category and optional project
                    const categoryMatch = expense.category === budget.category;
                    const projectMatch = budget.projectId ? expense.projectId === budget.projectId : true;
                    
                    // Check if expense is within budget period
                    const expenseDate = new Date(expense.date);
                    const budgetStart = new Date(budget.startDate);
                    const budgetEnd = new Date(budget.endDate);
                    const dateMatch = expenseDate >= budgetStart && expenseDate <= budgetEnd;
                    
                    return categoryMatch && projectMatch && dateMatch;
                });
                
                const spentAmount = budgetExpenses.reduce((total, expense) => total + expense.amount, 0);
                
                // Update budget if spent amount has changed
                if (budget.spentAmount !== spentAmount) {
                    const newStatus = spentAmount > budget.allocatedAmount ? 'exceeded' : 'active';
                    editBudget(budget.id, { spentAmount, status: newStatus }).catch(console.error);
                }
            });
        }
    }, [expenses, budgets]);

    const hasCurrentData = Boolean(userId && isAdmin && loadedUserId === userId);
    const value = {
        // Data
        revenues: hasCurrentData ? revenues : [],
        expenses: hasCurrentData ? expenses : [],
        budgets: hasCurrentData ? budgets : [],
        loading: Boolean(userId && isAdmin && !hasCurrentData),
        error,
        
        // Revenue operations
        addRevenue,
        editRevenue,
        removeRevenue,
        
        // Expense operations
        addExpense,
        editExpense,
        removeExpense,
        
        // Budget operations
        addBudget,
        editBudget,
        removeBudget,
        
        // Calculations
        getTotalRevenue,
        getTotalExpenses,
        getNetProfit,
        getProjectFinancials
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}
