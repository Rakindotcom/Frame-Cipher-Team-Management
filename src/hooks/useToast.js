import { useContext } from 'react';
import { ToastContext } from '../context/contexts';

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return {
        ...context,
        success: (message) => context.addToast(message, 'success'),
        error: (message) => context.addToast(message, 'error'),
        warning: (message) => context.addToast(message, 'warning'),
        info: (message) => context.addToast(message, 'info')
    };
}
