import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToUsers, updateUserRole, updateUserName, getAllUsers } from '../firebase/firestore';
import { useAuth } from './AuthContext';

const UsersContext = createContext(null);

export function UsersProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setUsers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToUsers((usersList) => {
            setUsers(usersList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

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

    const getUserById = (userId) => {
        return users.find(u => u.id === userId);
    };

    const getUserName = (userId) => {
        const foundUser = users.find(u => u.id === userId);
        return foundUser?.name || 'Unknown User';
    };

    const value = {
        users,
        loading,
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

export function useUsers() {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('useUsers must be used within a UsersProvider');
    }
    return context;
}

export default UsersContext;
