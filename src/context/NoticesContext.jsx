import { useEffect, useState } from 'react';
import {
    subscribeToNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    addNoticeComment
} from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { NoticesContext } from './contexts';

export function NoticesProvider({ children }) {
    const [notices, setNotices] = useState([]);
    const [loadedUserId, setLoadedUserId] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToNotices((noticesList) => {
            setNotices(noticesList);
            setLoadedUserId(userId);
        });

        return () => unsubscribe();
    }, [userId]);

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

    const hasCurrentData = Boolean(userId && loadedUserId === userId);
    const value = {
        notices: hasCurrentData ? notices : [],
        loading: Boolean(userId && !hasCurrentData),
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
