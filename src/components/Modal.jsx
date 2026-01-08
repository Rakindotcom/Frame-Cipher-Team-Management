export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
                {/* Backdrop */}
                <div
                    className="modal-backdrop"
                    onClick={onClose}
                ></div>

                {/* Modal - Mobile: Bottom sheet, Desktop: Centered */}
                <div className={`modal-content ${sizeClasses[size]} w-full p-4 sm:p-6 rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto`}>
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h2 className="text-base sm:text-lg font-semibold text-gradient">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-[--text-muted] hover:text-[--text-primary] hover:bg-[--bg-tertiary] transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
