import { useCallback, useEffect, useState } from 'react';
import {
    subscribeToProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject
} from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { ProjectsContext } from './contexts';

export function ProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loadedUserId, setLoadedUserId] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const userId = user?.uid;

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeToProjects((projectsList) => {
            setProjects(projectsList);
            setLoadedUserId(userId);
        });

        return () => unsubscribe();
    }, [userId]);

    const addProject = async (projectData) => {
        try {
            setError(null);
            const id = await createProject({
                ...projectData,
                createdBy: user.uid
            });
            return id;
        } catch (err) {
            console.error('Error creating project:', err);
            setError(err.message);
            throw err;
        }
    };

    const editProject = async (projectId, updates) => {
        try {
            setError(null);
            await updateProject(projectId, updates);
        } catch (err) {
            console.error('Error updating project:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeProject = async (projectId) => {
        try {
            setError(null);
            await deleteProject(projectId);
        } catch (err) {
            console.error('Error deleting project:', err);
            setError(err.message);
            throw err;
        }
    };

    const fetchProject = useCallback(async (projectId) => {
        try {
            return await getProject(projectId);
        } catch (err) {
            console.error('Error fetching project:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    const hasCurrentData = Boolean(userId && loadedUserId === userId);
    const value = {
        projects: hasCurrentData ? projects : [],
        loading: Boolean(userId && !hasCurrentData),
        error,
        addProject,
        editProject,
        removeProject,
        fetchProject
    };

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
}
