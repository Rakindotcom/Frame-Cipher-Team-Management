import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useFinance } from '../context/FinanceContext';

// Import Finance subsection components (to be created)
import FinanceDashboard from '../components/finance/FinanceDashboard';
import RevenueSection from '../components/finance/RevenueSection';
import ExpenseSection from '../components/finance/ExpenseSection';
import BudgetSection from '../components/finance/BudgetSection';
import ReportsSection from '../components/finance/ReportsSection';

export default function FinancePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';
    const { loading } = useFinance();

    const tabs = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            id: 'revenue',
            label: 'Revenue',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            )
        },
        {
            id: 'expenses',
            label: 'Expenses',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            id: 'budgets',
            label: 'Budgets',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        }
    ];

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    const renderActiveSection = () => {
        switch (activeTab) {
            case 'dashboard':
                return <FinanceDashboard />;
            case 'revenue':
                return <RevenueSection />;
            case 'expenses':
                return <ExpenseSection />;
            case 'budgets':
                return <BudgetSection />;
            case 'reports':
                return <ReportsSection />;
            default:
                return <FinanceDashboard />;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="spinner spinner-lg mx-auto mb-4"></div>
                        <p className="text-[--text-muted]">Loading financial data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[--text-primary]">Finance</h1>
                    <p className="text-[--text-muted] mt-1">
                        Manage financial data, budgets, and reports
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-[--glass-border]">
                    <nav className="flex space-x-8" aria-label="Finance sections">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-[--accent-cyan] text-[--accent-cyan]'
                                        : 'border-transparent text-[--text-muted] hover:text-[--text-primary] hover:border-[--text-muted]'
                                }`}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Active Section Content */}
                <div className="animate-fade-in">
                    {renderActiveSection()}
                </div>
            </div>
        </Layout>
    );
}