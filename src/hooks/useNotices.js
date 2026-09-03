import { useContext } from 'react';
import { NoticesContext } from '../context/contexts';

export function useNotices() {
    const context = useContext(NoticesContext);
    if (!context) {
        throw new Error('useNotices must be used within a NoticesProvider');
    }
    return context;
}
