/**
 * @typedef {Object} User
 * @property {string} id - Firebase UID
 * @property {string} name - User's display name
 * @property {string} email - User's email
 * @property {'admin'|'member'} role - User role
 * @property {Date|Object} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Firestore document ID
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {string} createdBy - User ID of creator
 * @property {Date|Object} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} Comment
 * @property {string} id - Comment ID
 * @property {string} userId - Commenter's user ID
 * @property {string} message - Comment text
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @typedef {Object} ActivityLog
 * @property {string} timestamp - ISO timestamp
 * @property {string} userId - User who performed action
 * @property {string} eventType - Type of event
 * @property {Object} metadata - Additional event data
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Firestore document ID
 * @property {string} projectId - Parent project ID
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string} assignedTo - User ID of assignee
 * @property {'low'|'medium'|'high'} priority - Task priority
 * @property {string} deadline - ISO date string
 * @property {'todo'|'in-progress'|'review'|'need-fixing'|'done'} status - Task status
 * @property {Comment[]} comments - Task comments
 * @property {ActivityLog[]} activity - Activity history
 * @property {string} createdBy - User ID of creator
 * @property {Date|Object} createdAt - Creation timestamp
 */

// Status options for tasks
export const TASK_STATUSES = ['todo', 'in-progress', 'review', 'need-fixing', 'done'];

// Priority options for tasks
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

// Role options for users
export const USER_ROLES = ['admin', 'member'];

/**
 * @typedef {Object} RevenueEntry
 * @property {string} id - Firestore document ID
 * @property {number} amount - Revenue amount (positive number)
 * @property {string} source - Revenue source/client
 * @property {string} description - Revenue description
 * @property {string} [projectId] - Optional associated project ID
 * @property {string} category - Revenue category
 * @property {string} date - ISO date string
 * @property {string} createdBy - User ID of creator
 * @property {Date|Object} createdAt - Creation timestamp
 * @property {Date|Object} [updatedAt] - Last update timestamp
 */

/**
 * @typedef {Object} ExpenseEntry
 * @property {string} id - Firestore document ID
 * @property {number} amount - Expense amount (positive number)
 * @property {string} category - Expense category
 * @property {string} description - Expense description
 * @property {string} [projectId] - Optional associated project ID
 * @property {string} [vendor] - Vendor/supplier name
 * @property {string} date - ISO date string
 * @property {string} createdBy - User ID of creator
 * @property {Date|Object} createdAt - Creation timestamp
 * @property {Date|Object} [updatedAt] - Last update timestamp
 */

/**
 * @typedef {Object} Budget
 * @property {string} id - Firestore document ID
 * @property {string} name - Budget name
 * @property {string} category - Budget category
 * @property {number} allocatedAmount - Total allocated amount
 * @property {number} spentAmount - Amount spent so far
 * @property {string} [projectId] - Optional associated project ID
 * @property {string} startDate - ISO date string for budget start
 * @property {string} endDate - ISO date string for budget end
 * @property {'active'|'completed'|'exceeded'} status - Budget status
 * @property {string} createdBy - User ID of creator
 * @property {Date|Object} createdAt - Creation timestamp
 * @property {Date|Object} [updatedAt] - Last update timestamp
 */

/**
 * @typedef {Object} DateRange
 * @property {string} startDate - ISO date string
 * @property {string} endDate - ISO date string
 */

/**
 * @typedef {Object} ProjectFinancials
 * @property {number} totalRevenue - Total revenue for project
 * @property {number} totalExpenses - Total expenses for project
 * @property {number} netProfit - Net profit (revenue - expenses)
 * @property {RevenueEntry[]} revenues - Revenue entries for project
 * @property {ExpenseEntry[]} expenses - Expense entries for project
 */

// Revenue categories
export const REVENUE_CATEGORIES = [
    'Client Payments',
    'Project Revenue',
    'Consulting Fees',
    'License Revenue',
    'Other Income'
];

// Expense categories
export const EXPENSE_CATEGORIES = [
    'Software & Tools',
    'Hardware & Equipment',
    'Marketing & Advertising',
    'Office Supplies',
    'Travel & Transportation',
    'Professional Services',
    'Utilities',
    'Other Expenses'
];

// Budget statuses
export const BUDGET_STATUSES = ['active', 'completed', 'exceeded'];
