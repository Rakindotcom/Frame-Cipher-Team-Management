import { createContext, useContext, useState, useCallback } from 'react';
import Modal from './Modal';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: null
    });

    const confirm = useCallback(({ title, message, confirmText, cancelText, type }) => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                title: title || 'Confirm Action',
                message: message || 'Are you sure?',
                confirmText: confirmText || 'Confirm',
                cancelText: cancelText || 'Cancel',
                type: type || 'danger',
                onConfirm: resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        confirmState.onConfirm?.(true);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    };

    const handleCancel = () => {
        confirmState.onConfirm?.(false);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <Modal
                isOpen={confirmState.isOpen}
                onClose={handleCancel}
                title={confirmState.title}
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-[--text-secondary]">{confirmState.message}</p>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={handleCancel}
                            className="btn-ghost"
                        >
                            {confirmState.cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={confirmState.type === 'danger' ? 'btn-danger' : 'btn-primary'}
                        >
                            {confirmState.confirmText}
                        </button>
                    </div>
                </div>
            </Modal>
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
}
