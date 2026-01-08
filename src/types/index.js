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
