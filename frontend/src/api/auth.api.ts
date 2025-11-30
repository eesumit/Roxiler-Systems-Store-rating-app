import axios from './axios';
import type { AuthResponse, LoginFormData, SignupFormData, ApiResponse } from '../types';

export const authAPI = {
    // signup
    signup: async (data:SignupFormData):Promise<AuthResponse>=>{
        const response = await axios.post('./auth/signup',data);
        return response.data;
    },
    // login
    login: async (data:LoginFormData):Promise<AuthResponse>=>{
        const response = await axios.post('./auth/login',data);
        return response.data;
    },
    //change password
    changePassword:async (data:{
        currentPassword:string;
        newPassword:string;
        confirmPassword:string;
    }):Promise<ApiResponse>=>{
        const response = await axios.post('./auth/change-password',data);
        return response.data;
    },
    //Forgot password
    forgotPassword:async (email:string):Promise<ApiResponse>=>{
        const response = await axios.post('./auth/forgot-password',{email});
        return response.data;
    },
    //Reset password
    resetPassword:async (token:string,newPassword:string):Promise<ApiResponse>=>{
        const response = await axios.post(`auth/reset-password/${token}`,{
            newPassword,confirmPassword:newPassword
        });
        return response.data;
    },
};