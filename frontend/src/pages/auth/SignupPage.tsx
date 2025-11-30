import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { authAPI } from '../../api/auth.api';
const signupSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(60),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(16)
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Password must contain at least one uppercase letter and one special character'),
    address: z.string().min(1, 'Address is required').max(400),
});
type SignupFormData = z.infer<typeof signupSchema>;
export const SignupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });
    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        try {
            const response = await authAPI.signup(data);
            login(response.data.user, response.data.token);
            toast.success('Account created successfully!');
            navigate('/stores');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input {...register('name')} className="input-field mt-1" />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input {...register('email')} type="email" className="input-field mt-1" />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input {...register('password')} type="password" className="input-field mt-1" />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea {...register('address')} className="input-field mt-1" rows={3} />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
                        {isLoading ? 'Creating account...' : 'Sign up'}
                    </button>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};