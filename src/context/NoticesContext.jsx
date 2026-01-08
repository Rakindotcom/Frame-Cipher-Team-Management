import { createContext, useContext, useEffect, useState } from 'react';
import {
    subscribeToNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    addNoticeComment
} from '../firebase/firestore';
import { useAuth } from './AuthContext';

const NoticesContext = createContext(null);

export function NoticesProvider({ children }) {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setNotices([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToNotices((noticesList) => {
            setNotices(noticesList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addNotice = async (noticeData) => {
        try {
            setError(null);
            const id = await createNotice({
                ...noticeData,
                createdBy: user.uid
            });
            return id;
        } catch (err) {
            console.error('Error creating notice:', err);
            setError(err.message);
            throw err;
        }
    };

    const editNotice = async (noticeId, updates) => {
        try {
            setError(null);
            await updateNotice(noticeId, updates);
        } catch (err) {
            console.error('Error updating notice:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeNotice = async (noticeId) => {
        try {
            setError(null);
            await deleteNotice(noticeId);
        } catch (err) {
            console.error('Error deleting notice:', err);
            setError(err.message);
            throw err;
        }
    };

    const addComment = async (noticeId, commentData) => {
        try {
            setError(null);
            await addNoticeComment(noticeId, commentData);
        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err.message);
            throw err;
        }
    };

    const value = {
        notices,
        loading,
        error,
        addNotice,
        editNotice,
        removeNotice,
        addComment
    };

    return (
        <NoticesContext.Provider value={value}>
            {children}
        </NoticesContext.Provider>
    );
}

export function useNotices() {
    const context = useContext(NoticesContext);
    if (!context) {
        throw new Error('useNotices must be used within a NoticesProvider');
    }
    return context;
}

export default NoticesContext;
