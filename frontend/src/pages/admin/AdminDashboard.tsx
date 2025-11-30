import { useState, useEffect } from 'react';
import { Users, Store, Star, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '../../api/dashboard.api';
import { userAPI } from '../../api/user.api';
import { storeAPI } from '../../api/store.api';
import { useToast } from '../../hooks/useToast';
import type { User, Store as StoreType } from '../../types';

export const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [stores, setStores] = useState<StoreType[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stores'>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [statsResponse, usersResponse, storesResponse] = await Promise.all([
                dashboardAPI.getAdminStats(),
                userAPI.getAllUsers({ limit: 100 }),
                storeAPI.getStores({ limit: 100 }),
            ]);

            setStats(statsResponse.data);
            setUsers(usersResponse.data?.users || []);
            setStores(storesResponse.data?.stores || []);
        } catch (error: any) {
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await userAPI.deleteUser(id);
            toast.success('User deleted successfully');
            fetchDashboardData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleDeleteStore = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this store?')) return;

        try {
            await storeAPI.deleteStore(id);
            toast.success('Store deleted successfully');
            fetchDashboardData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete store');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`${activeTab === 'overview'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${activeTab === 'users'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`${activeTab === 'stores'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Stores ({stores.length})
                    </button>
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card bg-blue-50 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                                    <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
                                </div>
                                <Users className="h-12 w-12 text-blue-600" />
                            </div>
                        </div>

                        <div className="card bg-green-50 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Total Stores</p>
                                    <p className="text-3xl font-bold text-green-900">{stats.totalStores}</p>
                                </div>
                                <Store className="h-12 w-12 text-green-600" />
                            </div>
                        </div>

                        <div className="card bg-yellow-50 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600">Total Ratings</p>
                                    <p className="text-3xl font-bold text-yellow-900">{stats.totalRatings}</p>
                                </div>
                                <Star className="h-12 w-12 text-yellow-600" />
                            </div>
                        </div>

                        <div className="card bg-purple-50 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Avg Rating</p>
                                    <p className="text-3xl font-bold text-purple-900">{stats.averageRating}</p>
                                </div>
                                <TrendingUp className="h-12 w-12 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Users by Role */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Admins</span>
                                <span className="font-semibold text-gray-900">{stats.usersByRole?.admin || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Regular Users</span>
                                <span className="font-semibold text-gray-900">{stats.usersByRole?.user || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Store Owners</span>
                                <span className="font-semibold text-gray-900">{stats.usersByRole?.store_owner || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'store_owner' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stores Tab */}
            {activeTab === 'stores' && (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stores.map((store) => (
                                    <tr key={store.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {store.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {store.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ⭐ {store.averageRating || '0.00'} ({store.totalRatings || 0})
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleDeleteStore(store.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
