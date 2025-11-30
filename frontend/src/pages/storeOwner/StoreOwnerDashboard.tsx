import { useState, useEffect } from 'react';
import { Store, Star, TrendingUp, Users } from 'lucide-react';
import { dashboardAPI } from '../../api/dashboard.api';
import { useToast } from '../../hooks/useToast';

export const StoreOwnerDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await dashboardAPI.getStoreOwnerStats();
            setStats(response.data);
        } catch (error: any) {
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    if (!stats || !stats.storeInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">No store assigned to your account</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
            </div>

            {/* Store Info Card */}
            <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{stats.storeInfo.name}</h2>
                        <p className="text-gray-600">Your Store</p>
                    </div>
                    <Store className="h-16 w-16 text-blue-600" />
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600">Average Rating</p>
                            <p className="text-4xl font-bold text-yellow-900">{stats.storeInfo.averageRating}</p>
                        </div>
                        <Star className="h-12 w-12 text-yellow-600 fill-current" />
                    </div>
                </div>

                <div className="card bg-green-50 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Total Ratings</p>
                            <p className="text-4xl font-bold text-green-900">{stats.storeInfo.totalRatings}</p>
                        </div>
                        <TrendingUp className="h-12 w-12 text-green-600" />
                    </div>
                </div>

                <div className="card bg-purple-50 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">Total Reviews</p>
                            <p className="text-4xl font-bold text-purple-900">{stats.recentRatings?.length || 0}</p>
                        </div>
                        <Users className="h-12 w-12 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = stats.ratingDistribution?.[rating] || 0;
                        const percentage = stats.storeInfo.totalRatings > 0
                            ? (count / stats.storeInfo.totalRatings) * 100
                            : 0;

                        return (
                            <div key={rating} className="flex items-center">
                                <div className="flex items-center w-20">
                                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                                    <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-yellow-400 h-4 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="w-16 text-right">
                                    <span className="text-sm font-medium text-gray-700">{count}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Ratings */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Ratings</h3>
                {stats.recentRatings && stats.recentRatings.length > 0 ? (
                    <div className="space-y-4">
                        {stats.recentRatings.map((rating: any) => (
                            <div key={rating.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{rating.userName}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-lg font-semibold text-gray-900">{rating.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No ratings yet</p>
                )}
            </div>
        </div>
    );
};
