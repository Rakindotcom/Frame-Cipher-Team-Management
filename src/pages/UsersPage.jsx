import Layout from '../components/Layout';
import UserManagement from '../components/UserManagement';

export default function UsersPage() {
    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[--text-primary]">Team Members</h1>
                    <p className="text-[--text-muted] mt-1">
                        Manage user roles and permissions
                    </p>
                </div>

                <UserManagement />
            </div>
        </Layout>
    );
}
