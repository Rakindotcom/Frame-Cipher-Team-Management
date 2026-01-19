import { useState } from 'react';

const INDUSTRIES = [
    'Tech',
    'Fashion',
    'Real Estate',
    'Personal Brand',
    'Food & Beverage',
    'Healthcare',
    'Finance',
    'Education',
    'Entertainment',
    'Non-Profit',
    'Other'
];

const ENGAGEMENT_TYPES = [
    'Retainer',
    'Project-Based',
    'Campaign'
];

const SERVICES = [
    'Video Production',
    'Motion Graphics',
    'Brand Content',
    'Editing',
    'Social Media Content',
    'Property Tours',
    'Drone Footage',
    'Marketing Videos',
    'Content Strategy',
    'Product Demos',
    'Explainer Videos',
    'Brand Storytelling',
    'Photography'
];

export default function ClientForm({ initialData, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData?.name || '');
    const [industry, setIndustry] = useState(initialData?.industry || '');
    const [engagementType, setEngagementType] = useState(initialData?.engagementType || '');
    const [startDate, setStartDate] = useState(initialData?.startDate || '');
    const [endDate, setEndDate] = useState(initialData?.endDate || '');
    const [services, setServices] = useState(initialData?.services || []);
    const [impact, setImpact] = useState(initialData?.impact || '');
    const [loading, setLoading] = useState(false);

    const handleServiceToggle = (service) => {
        setServices(prev => 
            prev.includes(service) 
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                name,
                industry,
                engagementType,
                startDate,
                endDate: endDate || null,
                services,
                impact
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Client Name <span className="text-[--accent-red]">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-dark"
                        placeholder="e.g. TechFlow Solutions"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Industry <span className="text-[--accent-red]">*</span>
                    </label>
                    <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="select-dark"
                        required
                    >
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Engagement Type <span className="text-[--accent-red]">*</span>
                    </label>
                    <select
                        value={engagementType}
                        onChange={(e) => setEngagementType(e.target.value)}
                        className="select-dark"
                        required
                    >
                        <option value="">Select Type</option>
                        {ENGAGEMENT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Start Date <span className="text-[--accent-red]">*</span>
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input-dark"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input-dark"
                        placeholder="Leave empty if ongoing"
                    />
                    <p className="text-xs text-[--text-muted]">Leave empty if ongoing</p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Services Delivered <span className="text-[--accent-red]">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-[--bg-tertiary] rounded-lg border border-[--glass-border]">
                    {SERVICES.map(service => (
                        <label key={service} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={services.includes(service)}
                                onChange={() => handleServiceToggle(service)}
                                className="rounded border-[--glass-border] bg-[--bg-primary] text-[--accent-cyan] focus:ring-[--accent-cyan] focus:ring-offset-0"
                            />
                            <span className="text-sm text-[--text-secondary]">{service}</span>
                        </label>
                    ))}
                </div>
                {services.length === 0 && (
                    <p className="text-xs text-[--accent-red]">Please select at least one service</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Impact Summary <span className="text-[--accent-red]">*</span>
                </label>
                <textarea
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    className="textarea-dark"
                    placeholder="e.g. Delivered 40+ high-performing video assets across 6 months"
                    rows={3}
                    required
                />
                <p className="text-xs text-[--text-muted]">
                    Brief, result-oriented description of the project impact
                </p>
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
                    disabled={loading || !name.trim() || !industry || !engagementType || !startDate || services.length === 0 || !impact.trim()}
                >
                    {loading ? (
                        <>
                            <div className="spinner spinner-sm"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{initialData ? 'Update Client' : 'Add Client'}</span>
                    )}
                </button>
            </div>
        </form>
    );
}