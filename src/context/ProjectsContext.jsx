import { createContext, useContext, useEffect, useState } from 'react';
import {
    subscribeToProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject
} from '../firebase/firestore';
import { useAuth } from './AuthContext';

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setProjects([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToProjects((projectsList) => {
            setProjects(projectsList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

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

    const fetchProject = async (projectId) => {
        try {
            return await getProject(projectId);
        } catch (err) {
            console.error('Error fetching project:', err);
            setError(err.message);
            throw err;
        }
    };

    const value = {
        projects,
        loading,
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

export function useProjects() {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
}

export default ProjectsContext;
