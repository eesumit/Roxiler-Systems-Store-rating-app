import axios from './axios';
import type { ApiResponse } from '../types';

export const dashboardAPI = {
    // Get admin dashboard statistics
    getAdminStats: async (): Promise<ApiResponse<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
        averageRating: string;
        usersByRole: {
            admin: number;
            user: number;
            store_owner: number;
        };
        recentActivity: Array<{
            type: string;
            message: string;
            timestamp: string;
        }>;
    }>> => {
        const response = await axios.get('/dashboard/admin');
        return response.data;
    },

    // Get store owner dashboard statistics
    getStoreOwnerStats: async (): Promise<ApiResponse<{
        storeInfo: {
            id: string;
            name: string;
            averageRating: string;
            totalRatings: number;
        };
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
        recentRatings: Array<{
            id: string;
            rating: number;
            userName: string;
            createdAt: string;
        }>;
    }>> => {
        const response = await axios.get('/dashboard/store-owner');
        return response.data;
    },
};
