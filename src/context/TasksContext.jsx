import { useEffect, useMemo, useState, useCallback } from 'react';
import {
    subscribeToAllTasks,
    subscribeToTask,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    getTask
} from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { TasksContext } from './contexts';

export function TasksProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loadedUserId, setLoadedUserId] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToAllTasks((tasksList) => {
            setTasks(tasksList);
            setLoadedUserId(userId);
        });

        return () => unsubscribe();
    }, [userId]);

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

    const hasCurrentData = Boolean(userId && loadedUserId === userId);
    const activeTasks = useMemo(
        () => hasCurrentData ? tasks : [],
        [hasCurrentData, tasks]
    );

    const getTasksByProject = useCallback((projectId) => {
        return activeTasks.filter(task => task.projectId === projectId);
    }, [activeTasks]);

    const getTasksByUser = useCallback((userId) => {
        return activeTasks.filter(task => task.assignedTo === userId);
    }, [activeTasks]);

    const getMyTasks = useCallback(() => {
        if (!user) return [];
        return activeTasks.filter(task => task.assignedTo === user.uid);
    }, [activeTasks, user]);

    const subscribeToSingleTask = useCallback((taskId, callback) => {
        return subscribeToTask(taskId, callback);
    }, []);

    const value = {
        tasks: activeTasks,
        loading: Boolean(userId && !hasCurrentData),
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
