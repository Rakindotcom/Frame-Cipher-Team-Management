import { useState } from 'react';

export default function ProjectForm({ initialData, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ name, description });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Project Name <span className="text-[--accent-red]">*</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. Website Redesign"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea-dark"
                    placeholder="Brief description of the project..."
                    rows={3}
                />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-ghost w-full sm:w-auto"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
                    disabled={loading || !name.trim()}
                >
                    {loading ? (
                        <>
                            <div className="spinner spinner-sm"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{initialData ? 'Update Project' : 'Create Project'}</span>
                    )}
                </button>
            </div>
        </form>
    );
}
