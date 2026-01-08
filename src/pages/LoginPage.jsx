import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../firebase/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Auth error:', err);
            setError(getErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (code) => {
        switch (code) {
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/invalid-credential':
                return 'Invalid email or password';
            default:
                return 'Failed to sign in. Please try again.';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-linear-to-br from-[--accent-cyan]/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-linear-to-br from-[--accent-cyan]/20 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-br from-[--accent-pink]/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-sm w-full relative z-10">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in-down">
                    <img
                        src="/logo.png"
                        alt="CKH Network"
                        className="w-32 mx-auto shadow-lg mb-4"
                    />
                    <h1 className="text-3xl font-bold text-gradient">CKH Network</h1>
                    <p className="text-[--text-muted] mt-2">Project Management Made Beautiful</p>
                </div>

                {/* Login Card */}
                <div className="glass-card-static p-6 animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-[--text-primary] mb-6 text-center">
                        Welcome Back
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-[--accent-red]/10 border border-[--accent-red]/30 rounded-lg">
                            <p className="text-[--accent-red] text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[--text-secondary]">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-dark"
                                placeholder="you@ckhnetwork.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[--text-secondary]">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-dark pr-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-primary] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner spinner-sm"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[--text-muted] text-xs">
                        Contact your admin for account access
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-[--text-muted] text-xs mt-6 animate-fade-in">
                    Secure • Fast • Beautiful
                </p>
            </div>
        </div>
    );
}
