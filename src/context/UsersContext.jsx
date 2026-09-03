import { useEffect, useState } from 'react';
import { subscribeToUsers, updateUserRole, updateUserName } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { UsersContext } from './contexts';

export function UsersProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [loadedUserId, setLoadedUserId] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToUsers((usersList) => {
            setUsers(usersList);
            setLoadedUserId(userId);
        });

        return () => unsubscribe();
    }, [userId]);

    const changeUserRole = async (userId, role) => {
        try {
            setError(null);
            await updateUserRole(userId, role);
        } catch (err) {
            console.error('Error updating user role:', err);
            setError(err.message);
            throw err;
        }
    };

    const changeUserName = async (userId, name) => {
        try {
            setError(null);
            await updateUserName(userId, name);
        } catch (err) {
            console.error('Error updating user name:', err);
            setError(err.message);
            throw err;
        }
    };

    const activeUsers = loadedUserId === userId ? users : [];

    const getUserById = (requestedUserId) => {
        return activeUsers.find(u => u.id === requestedUserId);
    };

    const getUserName = (requestedUserId) => {
        const foundUser = activeUsers.find(u => u.id === requestedUserId);
        return foundUser?.name || 'Unknown User';
    };

    const value = {
        users: activeUsers,
        loading: Boolean(userId && loadedUserId !== userId),
        error,
        changeUserRole,
        changeUserName,
        getUserById,
        getUserName
    };

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
}
