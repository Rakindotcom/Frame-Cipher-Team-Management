import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    subscribeToAllTasks,
    subscribeToProjectTasks,
    subscribeToUserTasks,
    subscribeToTask,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    getTask
} from '../firebase/firestore';
import { useAuth } from './AuthContext';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToAllTasks((tasksList) => {
            setTasks(tasksList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTask = async (taskData) => {
        try {
            setError(null);
            const id = await createTask({
                ...taskData,
                createdBy: user.uid
            });
            return id;
        } catch (err) {
            console.error('Error creating task:', err);
            setError(err.message);
            throw err;
        }
    };

    const editTask = async (taskId, updates, eventType = 'task_updated') => {
        try {
            setError(null);
            await updateTask(taskId, updates, user.uid, eventType);
        } catch (err) {
            console.error('Error updating task:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeTask = async (taskId) => {
        try {
            setError(null);
            await deleteTask(taskId);
        } catch (err) {
            console.error('Error deleting task:', err);
            setError(err.message);
            throw err;
        }
    };

    const addTaskComment = async (taskId, message) => {
        try {
            setError(null);
            await addComment(taskId, {
                userId: user.uid,
                message
            });
        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err.message);
            throw err;
        }
    };

    const fetchTask = async (taskId) => {
        try {
            return await getTask(taskId);
        } catch (err) {
            console.error('Error fetching task:', err);
            setError(err.message);
            throw err;
        }
    };

    const getTasksByProject = useCallback((projectId) => {
        return tasks.filter(task => task.projectId === projectId);
    }, [tasks]);

    const getTasksByUser = useCallback((userId) => {
        return tasks.filter(task => task.assignedTo === userId);
    }, [tasks]);

    const getMyTasks = useCallback(() => {
        if (!user) return [];
        return tasks.filter(task => task.assignedTo === user.uid);
    }, [tasks, user]);

    const subscribeToSingleTask = useCallback((taskId, callback) => {
        return subscribeToTask(taskId, callback);
    }, []);

    const value = {
        tasks,
        loading,
        error,
        addTask,
        editTask,
        removeTask,
        addTaskComment,
        fetchTask,
        getTasksByProject,
        getTasksByUser,
        getMyTasks,
        subscribeToSingleTask
    };

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
}

export default TasksContext;
