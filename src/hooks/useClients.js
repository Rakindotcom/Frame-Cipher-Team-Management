import { useContext } from 'react';
import { ClientsContext } from '../context/contexts';

export function useClients() {
    const context = useContext(ClientsContext);
    if (!context) {
        throw new Error('useClients must be used within a ClientsProvider');
    }
    return context;
}
