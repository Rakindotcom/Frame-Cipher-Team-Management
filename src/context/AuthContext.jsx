import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '../firebase/auth';
import { getUser, createUser } from '../firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setLoading(true);
            setError(null);

            if (firebaseUser) {
                try {
                    setUser(firebaseUser);

                    // Fetch or create user profile
                    let profile = await getUser(firebaseUser.uid);

                    if (!profile) {
                        // Create new user profile (first login)
                        const newProfile = {
                            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                            email: firebaseUser.email,
                            role: 'member' // Default role
                        };
                        await createUser(firebaseUser.uid, newProfile);
                        profile = { id: firebaseUser.uid, ...newProfile };
                    }

                    setUserProfile(profile);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    setError(err.message);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        userProfile,
        loading,
        error,
        isAdmin: userProfile?.role === 'admin',
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
