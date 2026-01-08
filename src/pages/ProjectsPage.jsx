import { useState } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import Modal from '../components/Modal';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';

export default function ProjectsPage() {
    const { projects, loading, addProject } = useProjects();
    const { isAdmin } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreateProject = async (projectData) => {
        await addProject(projectData);
        setShowCreateModal(false);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="spinner spinner-lg mx-auto mb-4"></div>
                        <p className="text-[--text-muted]">Loading projects...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[--text-primary]">
                            Projects
                        </h1>
                        <p className="text-[--text-muted] mt-1">
                            {projects.length} project{projects.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>New Project</span>
                        </button>
                    )}
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="glass-card-static">
                        <div className="empty-state py-16">
                            <svg className="empty-state-icon w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <p className="empty-state-title text-lg">No projects yet</p>
                            <p className="empty-state-description mb-6">
                                Create your first project to start organizing your work
                            </p>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="btn-primary inline-flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Create First Project</span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="New Project"
            >
                <ProjectForm
                    onSubmit={handleCreateProject}
                    onCancel={() => setShowCreateModal(false)}
                />
            </Modal>
        </Layout>
    );
}
