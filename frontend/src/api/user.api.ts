import axios from './axios';
import type { ApiResponse, User } from '../types';

export const userAPI = {
    // Get all users (admin only)
    getAllUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: 'admin' | 'user' | 'store_owner';
    }): Promise<ApiResponse<{
        users: User[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>> => {
        const response = await axios.get('/users', { params });
        return response.data;
    },

    // Get user profile
    getProfile: async (): Promise<ApiResponse<User>> => {
        const response = await axios.get('/users/profile');
        return response.data;
    },

    // Create user (admin only)
    createUser: async (data: {
        name: string;
        email: string;
        password: string;
        address: string;
        role: 'admin' | 'user' | 'store_owner';
    }): Promise<ApiResponse<User>> => {
        const response = await axios.post('/users', data);
        return response.data;
    },

    // Update user (admin only)
    updateUser: async (id: string, data: Partial<{
        name: string;
        email: string;
        address: string;
        role: 'admin' | 'user' | 'store_owner';
    }>): Promise<ApiResponse<User>> => {
        const response = await axios.put(`/users/${id}`, data);
        return response.data;
    },

    // Delete user (admin only)
    deleteUser: async (id: string): Promise<ApiResponse> => {
        const response = await axios.delete(`/users/${id}`);
        return response.data;
    },
};
