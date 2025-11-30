import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { authAPI } from '../../api/auth.api';
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
type LoginFormData = z.infer<typeof loginSchema>;
export const LoginPage = () => { 
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { isAuthenticated, user } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });
    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'store_owner') {
                navigate('/store-owner/dashboard');
            } else {
                navigate('/stores');
            }
        }
    }, [isAuthenticated, user, navigate]);
    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await authAPI.login(data);
            login(response.data.user, response.data.token);
            toast.success('Login successful!');

            // Redirect based on role
            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (response.data.user.role === 'store_owner') {
                navigate('/store-owner/dashboard');
            } else {
                navigate('/stores');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                className="input-field mt-1"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                className="input-field mt-1"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:text-blue-500">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};