import { useState } from 'react';
import { useUsers } from '../context/UsersContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { USER_ROLES } from '../types';
import { formatDate, getInitials, getAvatarColor } from '../utils/helpers';
import Modal from './Modal';

export default function UserManagement() {
    const { users, changeUserRole, changeUserName, loading } = useUsers();
    const { userProfile } = useAuth();
    const { addToast } = useToast();
    const [updatingUser, setUpdatingUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editName, setEditName] = useState('');

    const handleRoleChange = async (userId, newRole) => {
        if (userId === userProfile?.id) {
            addToast('You cannot change your own role', 'warning');
            return;
        }

        setUpdatingUser(userId);
        try {
            await changeUserRole(userId, newRole);
            addToast('User role updated successfully', 'success');
        } catch (error) {
            console.error('Error updating role:', error);
            addToast('Failed to update user role', 'error');
        } finally {
            setUpdatingUser(null);
        }
    };

    const handleEditName = (user) => {
        setEditingUser(user);
        setEditName(user.name || '');
    };

    const handleSaveName = async () => {
        if (!editName.trim()) {
            addToast('Name cannot be empty', 'warning');
            return;
        }

        try {
            await changeUserName(editingUser.id, editName.trim());
            addToast('User name updated successfully', 'success');
            setEditingUser(null);
            setEditName('');
        } catch (error) {
            console.error('Error updating name:', error);
            addToast('Failed to update user name', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="spinner spinner-lg mx-auto mb-4"></div>
                    <p className="text-[--text-muted]">Loading users...</p>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="glass-card-static">
                <div className="empty-state py-12">
                    <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="empty-state-title">No team members</p>
                    <p className="empty-state-description">Users will appear here once they sign in</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="stat-card">
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Total Members</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="stat-label">Admins</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{users.filter(u => u.role === 'member').length}</div>
                    <div className="stat-label">Members</div>
                </div>
            </div>

            {/* Users List */}
            <div className="glass-card-static overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[--glass-border]">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[--text-muted] uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[--text-muted] uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[--text-muted] uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[--text-muted] uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[--text-muted] uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[--glass-border]">
                            {users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-[--bg-tertiary]/30 transition-colors animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className={`avatar avatar-md bg-linear-to-br ${getAvatarColor(user.name)} text-white`}>
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[--text-primary]">
                                                    {user.name || <span className="text-[--accent-yellow]">No name set</span>}
                                                    {user.id === userProfile?.id && (
                                                        <span className="ml-2 badge badge-cyan text-[10px]">you</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-[--text-muted]">{user.email}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={user.id === userProfile?.id || updatingUser === user.id}
                                            className="select-dark py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {USER_ROLES.map((role) => (
                                                <option key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {updatingUser === user.id && (
                                            <span className="ml-2 inline-block">
                                                <div className="spinner spinner-sm"></div>
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-[--text-muted]">
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleEditName(user)}
                                            className="text-[--accent-cyan] hover:text-[--accent-cyan] text-sm font-medium transition-colors"
                                        >
                                            Edit Name
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Name Modal */}
            <Modal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title="Edit User Name"
                size="sm"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[--text-secondary] mb-2">
                            Full Name <span className="text-[--accent-red]">*</span>
                        </label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="input-dark"
                            placeholder="Enter full name"
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setEditingUser(null)}
                            className="btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveName}
                            className="btn-primary"
                            disabled={!editName.trim()}
                        >
                            Save Name
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
