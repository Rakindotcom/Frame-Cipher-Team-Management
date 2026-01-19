import { createContext, useContext, useEffect, useState } from 'react';
import {
    subscribeToClients,
    createClient,
    updateClient,
    deleteClient,
    getClient
} from '../firebase/firestore';
import { useAuth } from './AuthContext';

const ClientsContext = createContext(null);

export function ClientsProvider({ children }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setClients([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToClients((clientsList) => {
            setClients(clientsList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

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

    const value = {
        clients,
        loading,
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

export function useClients() {
    const context = useContext(ClientsContext);
    if (!context) {
        throw new Error('useClients must be used within a ClientsProvider');
    }
    return context;
}

export default ClientsContext;