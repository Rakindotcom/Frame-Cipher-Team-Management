import { useEffect, useState } from 'react';
import {
    subscribeToClients,
    createClient,
    updateClient,
    deleteClient,
    getClient
} from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { ClientsContext } from './contexts';

export function ClientsProvider({ children }) {
    const [clients, setClients] = useState([]);
    const [loadedUserId, setLoadedUserId] = useState(null);
    const [error, setError] = useState(null);
    const { user, isAdmin } = useAuth();
    const userId = user?.uid;

    useEffect(() => {
        if (!userId || !isAdmin) return;

        const unsubscribe = subscribeToClients((clientsList) => {
            setClients(clientsList);
            setLoadedUserId(userId);
        });

        return () => unsubscribe();
    }, [userId, isAdmin]);

    const addClient = async (clientData) => {
        try {
            setError(null);
            const id = await createClient({
                ...clientData,
                createdBy: user.uid
            });
            return id;
        } catch (err) {
            console.error('Error creating client:', err);
            setError(err.message);
            throw err;
        }
    };

    const editClient = async (clientId, updates) => {
        try {
            setError(null);
            await updateClient(clientId, updates);
        } catch (err) {
            console.error('Error updating client:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeClient = async (clientId) => {
        try {
            setError(null);
            await deleteClient(clientId);
        } catch (err) {
            console.error('Error deleting client:', err);
            setError(err.message);
            throw err;
        }
    };

    const fetchClient = async (clientId) => {
        try {
            return await getClient(clientId);
        } catch (err) {
            console.error('Error fetching client:', err);
            setError(err.message);
            throw err;
        }
    };

    const hasCurrentData = Boolean(userId && isAdmin && loadedUserId === userId);
    const value = {
        clients: hasCurrentData ? clients : [],
        loading: Boolean(userId && isAdmin && !hasCurrentData),
        error,
        addClient,
        editClient,
        removeClient,
        fetchClient
    };

    return (
        <ClientsContext.Provider value={value}>
            {children}
        </ClientsContext.Provider>
    );
}
